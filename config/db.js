const mongoose = require("mongoose");
require("dotenv").config();
const MONGOURL =process.env.ATLASDB_URL || "mongodb://localhost:27017/traworld";

async function connectDB() {
    try {
        await mongoose.connect(MONGOURL);
        console.log("Connected to DB");
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;