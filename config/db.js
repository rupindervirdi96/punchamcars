const mongoose = require('mongoose');

const connectDB = async () => {
    // Load environment variables via dynamic import to avoid top-level require
    const dotenv = await import('dotenv');
    dotenv.config();

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected...");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;