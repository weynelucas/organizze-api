// Dependencies (3rd-party)
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const requireDir = require('require-dir');


// Global app object
const app = express();
const server = require('http').createServer(app);


// Database config
mongoose.connect(
  'mongodb://localhost:27017/organizzeapi',
  { useNewUrlParser: true, useCreateIndex: true }
);
requireDir('./src/Model');


// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));


// Routes
app.use('/', require('./src/routes'));


// Starting server
server.listen(3100, '127.0.0.1', () => {
  const url = `http://${server.address().address}:${server.address().port}`;
  console.log(`Starting development server at ${url}`);
});