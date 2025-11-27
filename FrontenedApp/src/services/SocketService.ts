import io, { Socket } from 'socket.io-client';
import { Platform } from 'react-native';

import Config from 'react-native-config';

const getBaseUrl = () => {
    if (Config.API_BASE_URL) {
        return Config.API_BASE_URL.replace('/api', '');
    }
    return Platform.OS === 'ios' ? 'http://localhost:6000' : 'http://192.168.0.54:6000';
};

const BASE_URL = getBaseUrl();

class SocketService {
    private socket: Socket | null = null;

    connect() {
        if (this.socket) {
            return;
        }

        this.socket = io(BASE_URL);

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        } else {
            console.warn('Socket not connected. Cannot emit event:', event);
        }
    }

    on(event: string, callback: (...args: any[]) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event: string) {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

export const socketService = new SocketService();
