const PORT = 3000;
const express = require('express')
const app = express()
const { client } = require('./db')
const morgan = require('morgan');


client.connect()



require('dotenv').config();


app.use(morgan('dev'));
app.use(express.json())

app.listen(PORT, () => {
  console.log("The server is up on port", PORT)
})



const apiRouter = require('./api/');
app.use('/api', apiRouter);
