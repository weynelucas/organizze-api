function logging() {
  return (req, res, next) => {
    res.on('finish', () => {
      console.log(`[${new Date()}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${res.statusCode} ${res.statusMessage}`);
    });
    return next();
  }
}

module.exports = logging;