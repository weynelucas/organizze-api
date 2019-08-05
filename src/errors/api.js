const Status = {
  HTTP_400_BAD_REQUEST: 400,
  HTTP_401_UNAUTHORIZED: 401,
  HTTP_403_FORBIDDEN: 403,
  HTTP_404_NOT_FOUND: 404,
  HTTP_500_INTERNAL_SERVER_ERROR: 500,
};


class APIError extends Error {
  constructor(message) {
    super(message);

    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    // API error properties
    this.code = 'error';
    this.message = message || 'A server error occurred.';
    this.statusCode = Status.HTTP_500_INTERNAL_SERVER_ERROR;

    Error.captureStackTrace(this, this.constructor);
  }
} 


class NotFoundError extends APIError {
  constructor(message) {
    super(message);

    this.code = 'not_found';
    this.message = message || 'Not found.';
    this.statusCode = Status.HTTP_404_NOT_FOUND;
  }
}


class AuthenticationFailedError extends APIError {
  constructor(message) {
    super(message);

    this.code = 'authentication_failed';
    this.message = message || 'Incorrect authentication credentials.';
    this.statusCode = Status.HTTP_401_UNAUTHORIZED;
  }
}


class NotAuthenticatedError extends APIError {
  constructor(message) {
    super(message);

    this.code = 'not_authenticated';
    this.message = message || 'Authentication credentials were not provided.';
    this.statusCode = Status.HTTP_401_UNAUTHORIZED;
  }
}


class PermissionDeniedError extends APIError {
  constructor(message) {
    super(message);

    this.code = 'permission_denied';
    this.message = message || 'You do not have permission to perform this action.';
    this.statusCode = Status.HTTP_403_FORBIDDEN;
  }
}


module.exports = { 
  APIError, 
  NotFoundError, 
  AuthenticationFailedError, 
  NotAuthenticatedError,
  PermissionDeniedError 
};