const moment = require('moment');


function logging() {
  return (req, res, next) => {
    res.on('finish', () => {
      // Make the request log message
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

module.exports = logging;