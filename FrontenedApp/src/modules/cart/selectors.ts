import type { RootState } from '@app/redux/store';
import { CartItem } from './slice';

export const selectCartItems = (state: RootState): CartItem[] => state.cartReducer.items;

export const selectCartItemCount = (state: RootState): number => {
    return state.cartReducer.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
};

export const selectCartTotal = (state: RootState): number => {
    return state.cartReducer.items.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
};

export const selectCartItemById = (id: string) => (state: RootState): CartItem | undefined => {
    return state.cartReducer.items.find((item: CartItem) => item.id === id);
};
