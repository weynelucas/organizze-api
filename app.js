// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const cors = require('cors');


// Global app object
const app = express();


// Middlewares
app.use(cors());
app.use(express.json());


// Database config
mongoose.connect(
  'mongodb://localhost:27017/organizzeapi',
  { useNewUrlParser: true, useCreateIndex: true }
);
requireDir('./src/models');


// Routes
app.use('/', require('./src/routes'));


// Starting server
const server = app.listen(process.env.PORT || 3100, () => {
  console.log(`Listening on port ${server.address().port}`)
})
