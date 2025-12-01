import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    image: string;
    sparkline_in_7d: {
        price: number[];
    };
}

export const cryptoService = {
    /**
     * Get market data for specified coins
     */
    getMarketData: async (currency: string = 'usd', ids: string[] = ['bitcoin', 'ethereum', 'solana']): Promise<CoinData[]> => {
        try {
            const response = await axios.get<CoinData[]>(`${COINGECKO_API_URL}/coins/markets`, {
                params: {
                    vs_currency: currency,
                    ids: ids.join(','),
                    order: 'market_cap_desc',
                    per_page: 100,
                    page: 1,
                    sparkline: true,
                    price_change_percentage: '24h',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching crypto market data:', error);
            throw error;
        }
    },

    /**
     * Get historical chart data for a coin
     */
    getChartData: async (coinId: string, days: string = '1', currency: string = 'usd'): Promise<number[]> => {
        try {
            const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}/market_chart`, {
                params: {
                    vs_currency: currency,
                    days: days,
                },
            });
            return response.data.prices.map((price: [number, number]) => price[1]);
        } catch (error) {
            console.error(`Error fetching chart data for ${coinId}:`, error);
            throw error;
        }
    },
};
