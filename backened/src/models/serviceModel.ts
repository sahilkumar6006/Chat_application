import mongoose from "mongoose";

export interface IService extends mongoose.Document {
    title: string;
    price: number;
    description: string;
    categoryId: mongoose.Types.ObjectId;
}

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
        required: true,
    },
}, {
    timestamps: true,
});

const Service = mongoose.model<IService>("Service", serviceSchema);

export default Service;
