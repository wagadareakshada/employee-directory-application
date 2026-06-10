const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt connection using URI from .env
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Exit server if connection fails
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Export for use in server.js
module.exports = connectDB;

















