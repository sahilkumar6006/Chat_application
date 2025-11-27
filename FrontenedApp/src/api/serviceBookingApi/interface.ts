export interface IServiceCategory {
    _id: string;
    id: string;
    title: string;
    color: string;
}

export interface IService {
    _id: string;
    id: string;
    title: string;
    price: number;
    description: string;
    categoryId: string;
}

export interface IBookingItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
}

export interface ICreateBookingPayload {
    items: IBookingItem[];
    totalAmount: number;
}

export interface IBooking {
    _id: string;
    userId: string;
    items: IBookingItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export interface IServiceCategoryResponse {
    success: boolean;
    data: IServiceCategory[];
}

export interface IServiceResponse {
    success: boolean;
    data: IService[];
}

export interface IBookingResponse {
    success: boolean;
    message: string;
    data: {
        bookingId: string;
    };
}
