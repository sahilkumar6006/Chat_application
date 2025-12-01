import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import { cryptoService, CoinData } from '@app/services/CryptoService';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MarketScreen = () => {
    const { theme } = useTheme();
    const [coins, setCoins] = useState<CoinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

    const fetchMarketData = async () => {
        try {
            const data = await cryptoService.getMarketData();
            setCoins(data);
            if (data.length > 0 && !selectedCoin) {
                setSelectedCoin(data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch market data', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMarketData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMarketData();
    }, []);

    const renderChart = () => {
        const coin = coins.find((c) => c.id === selectedCoin);
        if (!coin || !coin.sparkline_in_7d || !coin.sparkline_in_7d.price) {
            return null;
        }

        // Take last 24 points for a simplified 24h view (assuming hourly data roughly)
        // Or just use the sparkline data provided by CoinGecko (usually 7 days hourly, so 168 points)
        // Let's slice to get a cleaner chart if needed, or use all.
        // CoinGecko sparkline is 7 days. For 24h we might need to fetch specific chart data or just show 7d trend.
        // The user asked for 24h chart.
        // Let's use the sparkline data for now as a "Trend" indicator, or fetch 24h specifically if we want precision.
        // For simplicity in this step, we'll visualize the sparkline (7d) as the "Trend".
        // To strictly follow "24h line chart", we should use `getChartData` from service.
        // But to keep it snappy and simple for the list view, let's use the sparkline data which is already there.
        // If we want strictly 24h, we can slice the last ~24 points of the 7d sparkline (168 hours).

        const recentPrices = coin.sparkline_in_7d.price.slice(-24);

        return (
            <View style={[styles.chartContainer, { backgroundColor: Colors[theme].surface }]}>
                <Text style={[styles.chartTitle, { color: Colors[theme].text }]}>
                    {coin.name} ({coin.symbol.toUpperCase()}) - 24h Trend
                </Text>
                <LineChart
                    data={{
                        labels: [], // Hide labels for cleaner look
                        datasets: [
                            {
                                data: recentPrices,
                            },
                        ],
                    }}
                    width={width - 40} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: Colors[theme].surface,
                        backgroundGradientFrom: Colors[theme].surface,
                        backgroundGradientTo: Colors[theme].surface,
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`, // Primary color
                        labelColor: (opacity = 1) => Colors[theme].textSecondary,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '0', // hide dots
                            strokeWidth: '0',
                            stroke: '#ffa726',
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    withDots={false}
                    withInnerLines={false}
                    withOuterLines={false}
                    withVerticalLabels={false}
                    withHorizontalLabels={true}
                />
            </View>
        );
    };

    const renderItem = ({ item }: { item: CoinData }) => {
        const isSelected = item.id === selectedCoin;
        return (
            <TouchableOpacity
                style={[
                    styles.coinItem,
                    {
                        backgroundColor: isSelected ? Colors[theme].primary + '20' : Colors[theme].surface,
                        borderColor: Colors[theme].border,
                    },
                ]}
                onPress={() => setSelectedCoin(item.id)}
            >
                <View style={styles.coinInfo}>
                    <Image source={{ uri: item.image }} style={styles.coinIcon} />
                    <View>
                        <Text style={[styles.coinSymbol, { color: Colors[theme].text }]}>
                            {item.symbol.toUpperCase()}
                        </Text>
                        <Text style={[styles.coinName, { color: Colors[theme].textSecondary }]}>
                            {item.name}
                        </Text>
                    </View>
                </View>
                <View style={styles.coinPrice}>
                    <Text style={[styles.priceText, { color: Colors[theme].text }]}>
                        ${item.current_price.toLocaleString()}
                    </Text>
                    <Text
                        style={[
                            styles.changeText,
                            {
                                color:
                                    item.price_change_percentage_24h >= 0
                                        ? '#4CAF50'
                                        : '#F44336',
                            },
                        ]}
                    >
                        {item.price_change_percentage_24h.toFixed(2)}%
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: Colors[theme].background }]}>
                <ActivityIndicator size="large" color={Colors[theme].primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: Colors[theme].text }]}>Market</Text>
            </View>

            <FlatList
                data={coins}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors[theme].primary} />
                }
                ListHeaderComponent={
                    <>
                        {selectedCoin && renderChart()}
                        <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>Top Assets</Text>
                    </>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    coinItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
    },
    coinInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
        borderRadius: 20,
    },
    coinSymbol: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    coinName: {
        fontSize: 14,
    },
    coinPrice: {
        alignItems: 'flex-end',
    },
    priceText: {
        fontSize: 16,
        fontWeight: '600',
    },
    changeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    chartContainer: {
        padding: 15,
        borderRadius: 16,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
});

export default MarketScreen;
