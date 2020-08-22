const express = require('express')
const app = express()


//if there is no environment variable we will run the backend on port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`SERVER STARTED ON PORT ${PORT}`))

app.get('/', (req, res) => res.send('API Running'))