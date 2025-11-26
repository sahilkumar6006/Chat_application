import mongoose from "mongoose";

export interface IServiceCategory extends mongoose.Document {
    title: string;
    color: string;
}

const serviceCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const ServiceCategory = mongoose.model<IServiceCategory>("ServiceCategory", serviceCategorySchema);

export default ServiceCategory;
