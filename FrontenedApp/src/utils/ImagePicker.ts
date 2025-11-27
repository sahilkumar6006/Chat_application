import { launchImageLibrary } from 'react-native-image-picker';
import { uploadToCloudinary } from './Cloudinary';

export async function pickAndUploadVideo() {
    const result = await launchImageLibrary({ mediaType: 'video' });

    if (result.didCancel) return null;

    const uri = result?.assets?.[0]?.uri;
    if (!uri) return null;

    console.log('Uploading video to Cloudinary...');
    const uploadResult = await uploadToCloudinary(uri);

    if (uploadResult && uploadResult.url) {
        console.log('Video URL:', uploadResult.url);
        return uploadResult.url;
    }

    return null;
}