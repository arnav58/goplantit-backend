const mongoose = require('mongoose');
const config = require("config");
const db = "mongodb+srv://developer:goplantit@goplantitcluster1.7gq26.mongodb.net/goplantitcluster1?retryWrites=true&w=majority";

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