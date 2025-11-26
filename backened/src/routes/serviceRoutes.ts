import { Router } from "express";
import { getCategories, getServicesByCategory, getAllServices, createBooking, getUserBookings } from "../controller/serviceController";
import authMiddleware from "../middleware/authMiddleware";

const ServiceRoutes = Router();

// Public routes
ServiceRoutes.get("/categories", getCategories);
ServiceRoutes.get("/services", getAllServices);
ServiceRoutes.get("/services/:categoryId", getServicesByCategory);

// Protected routes
ServiceRoutes.post("/bookings", authMiddleware, createBooking);
ServiceRoutes.get("/bookings", authMiddleware, getUserBookings);

export default ServiceRoutes;
