import React, { use, useEffect, useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { ReelsService } from '../../services/ReelsService';
import { pickAndUploadVideo } from '../../utils/ImagePicker';
import { authService } from '@app/services/authService';

const { width, height } = Dimensions.get('window');

const ReelsScreen = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReels();
    }, []);

    const fetchReels = async () => {
        try {
            const response = await ReelsService.getReels();
            setReels(response.data);
        } catch (error) {
            console.error('Failed to fetch reels:', error);
        }
    };

    const handleUpload = async () => {
        const user = await authService.getUser();
        console.log("in teh user", user)


        if (!user?._id) {
            console.error('User not logged in');
            return;
        }

        setLoading(true);
        try {
            const videoUrl = await pickAndUploadVideo();
            if (videoUrl) {
                // For now, we'll just use a placeholder thumbnail or the same video URL if it's an image (which it isn't)
                // Ideally, we'd generate a thumbnail.
                await ReelsService.createReel(videoUrl, '', 'New Reel', user._id);
                fetchReels();
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.videoContainer}>
            <Video
                source={{ uri: item.videoUrl }}
                style={styles.video}
                resizeMode="cover"
                repeat
                paused={false} // In a real app, you'd manage play/pause based on visibility
            />
            <View style={styles.overlay}>
                <Text style={styles.caption}>{item.caption}</Text>
                <Text style={styles.username}>@{item.userId?.name || 'User'}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={reels}
                renderItem={renderItem}
                keyExtractor={(item: any) => item._id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={height}
                decelerationRate="fast"
            />

            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.uploadText}>+</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    videoContainer: {
        width: width,
        height: height,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        left: 20,
    },
    caption: {
        color: 'white',
        fontSize: 16,
        marginBottom: 10,
    },
    username: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    uploadButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default ReelsScreen;
