const { APIError } = require('../Utils/Http');

function HttpExceptionHandler(err, req, res, next) {
  if (err instanceof APIError) {
    const { code, message } = err;
    return res
      .status(err.statusCode)
      .json({ code, message });
  }

  return next(err);
}

module.exports = HttpExceptionHandler;
