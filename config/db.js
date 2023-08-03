require('dotenv').config();
const mongoose = require('mongoose');


function connectDB() {
    //Database connection 

    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Database connected");
        })
        .catch((err) => {
            console.log("Connection failed");
        });
}

module.exports = connectDB;