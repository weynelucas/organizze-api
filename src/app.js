// Dependencies (3rd-party)
const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const cors = require('cors');
const morgan = require('morgan');


// Dependencies (local)
const settings = require('./config');


// Global app object
const app = express();


// Database config
mongoose.connect(
  'mongodb://localhost:27017/organizzeapi',
  { useNewUrlParser: true, useCreateIndex: true }
);
requireDir('./models');


// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));


// Routes
app.use('/', require('./routes'));


// Starting server
const server = app.listen(settings.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${server.address().port}`);
});
