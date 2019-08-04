const Status = {
  HTTP_400_BAD_REQUEST: 400,
  HTTP_401_UNAUTHORIZED: 401,
  HTTP_403_FORBIDDEN: 403,
  HTTP_404_NOT_FOUND: 404,
  HTTP_401_UNAUTHORIZED: 401,
  HTTP_500_INTERNAL_SERVER_ERROR: 500,
}


class APIError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = Status.HTTP_500_INTERNAL_SERVER_ERROR;
    this.message = this.message || this.constructor.defaultMessage;

    Error.captureStackTrace(this, this.constructor);
  }

  static get defaultMessage() {
    return 'A server error occurred.';
  }
} 


class NotFoundError extends APIError {
  constructor(message) {
    super(message);

    this.statusCode = Status.HTTP_404_NOT_FOUND;
  }

  static get defaultMessage() {
    return 'Not found.';
  }
}


class AuthenticationFailedError extends APIError {
  constructor(message) {
    super(message);

    this.statusCode = HTTP_401_UNAUTHORIZED;
  }

  static get defaultMessage() {
    return 'Incorrect authentication credentials.';
  }
  
}


class PermissionDeniedError extends APIError {
  constructor(message) {
    super(message);

    this.statusCode = Status.HTTP_403_FORBIDDEN;
  }

  static get defaultMessage() {
    return 'You do not have permission to perform this action.';
  }
}


module.exports = { 
  APIError, 
  NotFoundError, 
  AuthenticationFailedError, 
  PermissionDeniedError 
}