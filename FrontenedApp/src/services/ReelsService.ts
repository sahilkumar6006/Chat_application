import { request } from './request';

export const ReelsService = {
    createReel: async (videoUrl: string, thumbnailUrl: string, caption: string, userId: string) => {
        return request.post('/reel/create', { videoUrl, thumbnailUrl, caption, userId });
    },

    getReels: async () => {
        return request.get('/reel');
    }
};
