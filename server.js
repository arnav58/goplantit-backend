const express = require('express')
const app = express()
const connectDB = require('./config/db')
const bodyParser = require("body-parser")
var cors = require('cors')


//if there is no environment variable we will run the backend on port 5000
const PORT = process.env.PORT || 5000;
//the middleware that parse json in the request body, so we can use request.body 
//in the apis
app.use(express.json({extended: false}));
app.use(cors())
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/warnings', require('./routes/api/warnings'));
app.use('/api/weather_data', require('./routes/api/weather'));
app.use('/api/misc', require('./routes/api/misc'));

app.listen(PORT, ()=>console.log(`SERVER STARTED ON PORT ${PORT}`))
//api routes

//connect Database
connectDB();