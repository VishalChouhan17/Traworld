const mongoose = require("mongoose");

const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";

async function connectDB() {
    try {
        await mongoose.connect(MONGOURL);
        console.log("Connected to DB");
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;