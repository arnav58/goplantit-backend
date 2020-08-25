const express = require('express')
const app = express()
const connectDB = require('./config/db')
const bodyParser = require("body-parser")



//if there is no environment variable we will run the backend on port 5000
const PORT = process.env.PORT || 5000;

//the middleware that parse json in the request body, so we can use request.body 
//in the apis
app.use(express.json({extended: false}));

app.listen(PORT, ()=>console.log(`SERVER STARTED ON PORT ${PORT}`))


//api routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/warnings', require('./routes/api/warnings'));

//connect Database
connectDB();