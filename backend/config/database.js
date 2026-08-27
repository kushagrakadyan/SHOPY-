const mongoose = require('mongoose');

const connectDB = () => {
    const dbUri = process.env.DB_HOSTED_URI || process.env.DB_URI;

    if (!dbUri) {
        console.warn('MongoDB connection skipped: DB_HOSTED_URI or DB_URI is not configured');
        return Promise.resolve();
    }

    mongoose
        .connect(dbUri)
        .then(data => {
            console.log(
                `🚀 MongoDB connected with server: ${data.connection.host}`
            );
        })
        .catch(error => {
            console.error(`MongoDB connection error: ${error.message}`);
        });
}

module.exports = connectDB;
