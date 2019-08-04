const moment = require('moment');


function logger() {
  return (req, res, next) => {
    res.on('finish', () => {
      const message = [
        `[${moment().format('DD/MMM/YYYY hh:mm:ss')}]`,
        `"${req.method} ${req.originalUrl} HTTP/${req.httpVersion}"`,
        `${res.statusCode} ${res.statusMessage}`
      ].join(' ')
      
      console.log(message);
    });
    return next();
  }
}

module.exports = logger;