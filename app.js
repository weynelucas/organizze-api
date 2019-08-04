// Dependencies (3rd-party)
const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const cors = require('cors');


// Dependencies (local)
const settings = require('./src/config');
const logging = require('./src/middlewares/logging');


// Global app object
const app = express();


// Database config
mongoose.connect(
  'mongodb://localhost:27017/organizzeapi',
  { useNewUrlParser: true, useCreateIndex: true }
);
requireDir('./src/models');


// Middlewares
app.use(cors());
app.use(express.json());
app.use(logging());


// Routes
app.use('/', require('./src/routes'));


// Starting server
const server = app.listen(settings.port, () => {
  console.log(`Listening on port ${server.address().port}`)
})
