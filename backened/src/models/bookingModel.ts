import mongoose from "mongoose";

interface IBookingItem {
    serviceId: mongoose.Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
}

export interface IBooking extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    items: IBookingItem[];
    totalAmount: number;
    status: string;
    bookingId: string;
}

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        },
        title: String,
        price: Number,
        quantity: Number,
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },
    bookingId: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
