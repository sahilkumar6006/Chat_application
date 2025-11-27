import ServiceCategory from "../models/serviceCategoryModel";
import Service from "../models/serviceModel";
import Booking from "../models/bookingModel";
import { Request, Response } from "express";

// Get all service categories
const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await ServiceCategory.find();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get services by category
const getServicesByCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;

        // Validate if categoryId is a valid MongoDB ObjectId
        if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid category ID format. Must be a valid MongoDB ObjectId"
            });
        }

        const services = await Service.find({ categoryId });
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all services
const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await Service.find().populate('categoryId');
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a booking
const createBooking = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { items, totalAmount } = req.body;
        const bookingId = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const booking = await Booking.create({
            userId,
            items,
            totalAmount,
            bookingId,
        });

        res.status(201).json({ success: true, bookingId: booking.bookingId, booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get user bookings
const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getCategories, getServicesByCategory, getAllServices, createBooking, getUserBookings };
