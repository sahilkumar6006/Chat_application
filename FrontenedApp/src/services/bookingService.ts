import { CartItem } from '@/redux/slices/cartSlice';

export interface ServiceCategory {
    id: string;
    title: string;
    color: string;
}

export interface Service {
    id: string;
    title: string;
    price: number;
    description: string;
    categoryId: string;
}

const MOCK_CATEGORIES: ServiceCategory[] = [
    { id: '1', title: 'AC', color: '#007AFF' },
    { id: '2', title: 'Heater', color: '#FF9500' },
    { id: '3', title: 'Wiring', color: '#FFCC00' },
    { id: '4', title: 'Inverter', color: '#34C759' },
];

const MOCK_SERVICES: Service[] = [
    { id: '1', title: 'AC Gas Refilling', price: 499, description: 'R22, R32, or R410A gas refilling', categoryId: '1' },
    { id: '2', title: 'AC Deep Cleaning', price: 399, description: 'Indoor & outdoor unit cleaning', categoryId: '1' },
    { id: '3', title: 'AC Installation', price: 799, description: 'New AC installation', categoryId: '1' },
    { id: '4', title: 'AC Repair', price: 599, description: 'Compressor, PCB repair etc.', categoryId: '1' },
    { id: '5', title: 'AC Uninstallation', price: 299, description: 'Safe removal with gas lock', categoryId: '1' },
];

export const bookingService = {
    getCategories: async (): Promise<ServiceCategory[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_CATEGORIES);
            }, 500);
        });
    },

    getServices: async (categoryId: string): Promise<Service[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_SERVICES.filter(s => s.categoryId === categoryId || categoryId === '1')); // Fallback to '1' for demo
            }, 800);
        });
    },

    createBooking: async (items: CartItem[], totalAmount: number): Promise<{ success: boolean; bookingId: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, bookingId: `BK-${Math.floor(Math.random() * 10000)}` });
            }, 1500);
        });
    },
};
