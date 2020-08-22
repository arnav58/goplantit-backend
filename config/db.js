const mongoose = require('mongoose');
const config = require("config");
const db = config.get("mongoURI")

const connectDB = async () =>{
    try {
        await mongoose.connect(db, {
            useCreateIndex:true,
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useFindAndModify:false

        }) //await for the connection
        console.log("MongoDB is connected")
    } catch (err) {
        console.error.apply(err.message);
        process.exit(1); //exit with failure
    }
}
module.exports = connectDB;