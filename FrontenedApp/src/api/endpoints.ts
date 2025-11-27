/**
 * API Endpoints Enum
 * Centralized definition of all API endpoints
 */
export enum API {
    // Auth
    LOGIN = '/auth/login',
    REGISTER = '/auth/register',
    LOGOUT = '/auth/logout',
    GET_USER_INFO = '/auth/me',

    // Service Booking
    GET_SERVICE_CATEGORIES = '/service/categories',
    GET_SERVICES_BY_CATEGORY = '/service/services',
    CREATE_BOOKING = '/service/bookings',
    GET_USER_BOOKINGS = '/service/bookings/user',

    // Chat
    GET_CONVERSATIONS = '/chat/conversations',
    GET_MESSAGES = '/chat/messages',
    SEND_MESSAGE = '/chat/send',

    // Profile
    GET_PROFILE = '/user/profile',
    UPDATE_PROFILE = '/user/profile',
    UPLOAD_AVATAR = '/user/avatar',
}
