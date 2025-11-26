import mongoose from "mongoose";
import ServiceCategory from "./models/serviceCategoryModel";
import Service from "./models/serviceModel";
import dotenv from "dotenv";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect("mongodb+srv://sahilgorka123_db_user:sahil%40123@cluster0.awvyklm.mongodb.net/chatDB?retryWrites=true&w=majority");
        console.log("Connected to MongoDB");

        // Clear existing data
        await ServiceCategory.deleteMany({});
        await Service.deleteMany({});
        console.log("Cleared existing data");

        // Create categories
        const categories = await ServiceCategory.insertMany([
            { title: 'AC', color: '#007AFF' },
            { title: 'Heater', color: '#FF9500' },
            { title: 'Wiring', color: '#FFCC00' },
            { title: 'Inverter', color: '#34C759' },
        ]);
        console.log("Created categories");

        // Create services
        const acCategory = categories.find(c => c.title === 'AC');
        if (acCategory) {
            await Service.insertMany([
                { title: 'AC Gas Refilling', price: 499, description: 'R22, R32, or R410A gas refilling', categoryId: acCategory._id },
                { title: 'AC Deep Cleaning', price: 399, description: 'Indoor & outdoor unit cleaning', categoryId: acCategory._id },
                { title: 'AC Installation', price: 799, description: 'New AC installation', categoryId: acCategory._id },
                { title: 'AC Repair', price: 599, description: 'Compressor, PCB repair etc.', categoryId: acCategory._id },
                { title: 'AC Uninstallation', price: 299, description: 'Safe removal with gas lock', categoryId: acCategory._id },
            ]);
            console.log("Created services");
        }

        console.log("Seed data created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
