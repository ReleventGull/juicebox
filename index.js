require('dotenv').config();
const { PORT = 3000 } = process.env
const express = require('express')
const app = express()
const { client } = require('./db')
const morgan = require('morgan');


client.connect()





app.use(morgan('dev'));
app.use(express.json())

app.listen(PORT, () => {
  console.log("The server is up on port", PORT)
})



const apiRouter = require('./api/');
app.use('/api', apiRouter);
