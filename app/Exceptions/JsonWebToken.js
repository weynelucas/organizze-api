function JsonWebTokenExceptionHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err.message });
  }

  return next(err);
}

module.exports = JsonWebTokenExceptionHandler;