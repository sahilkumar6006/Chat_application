import axios from 'axios';

const CLOUD_NAME = 'ddcdwo7ho'
const UPLOAD_PRESET = 'testpublic'
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;



export const uploadToCloudinary = async (fileUriOrLink: string) => {
    try {
        const formData = new FormData();
        formData.append('upload_preset', UPLOAD_PRESET);

        if (fileUriOrLink.startsWith('file://') || fileUriOrLink.startsWith('content://')) {

            const fileType = fileUriOrLink.split('.').pop()?.toLowerCase() || 'jpg';

            let mimeType = 'image/jpeg';
            if (fileType === 'pdf') {
                mimeType = 'application/pdf';
            } else if (fileType === 'png') {
                mimeType = 'image/png';
            } else if (fileType === 'jpg' || fileType === 'jpeg') {
                mimeType = 'image/jpeg';
            } else if (fileType === 'mp4') {
                mimeType = 'video/mp4';
            } else if (fileType === 'mov') {
                mimeType = 'video/quicktime';
            }

            formData.append('file', {
                uri: fileUriOrLink,
                type: mimeType,
                name: `prescription.${fileType}`,
            } as any);
        } else {
            formData.append('file', fileUriOrLink);
        }

        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data && response.data.secure_url) {
            return {
                url: response.data.secure_url,
                public_id: response.data.public_id,
            };
        }
        return null;

    } catch (error: any) {
        console.error('Cloudinary Upload Error:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to upload prescription to Cloudinary.';
        throw new Error(errorMessage);
    }
};