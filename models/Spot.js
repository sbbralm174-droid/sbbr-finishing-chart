import mongoose from 'mongoose';

const spotSchema = new mongoose.Schema({
    floor: {
        type: Number,
        required: true,
    },
    date: {
        type: String, // YYYY-MM-DD format
        required: true,
    },
    name: {
        type: String, // e.g., '8-9', '9-10'
        required: true,
    },
    production: {
        type: Number,
        required: true,
    },
    spot: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
});

const Spot = mongoose.models.Data || mongoose.model('Data', spotSchema, "spot");

export default Spot;