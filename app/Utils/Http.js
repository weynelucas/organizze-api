const Status = {
  HTTP_200_OK: 200,
  HTTP_201_CREATED: 201,
  HTTP_204_NO_CONTENT: 204,
  HTTP_400_BAD_REQUEST: 400,
  HTTP_401_UNAUTHORIZED: 401,
  HTTP_403_FORBIDDEN: 403,
  HTTP_404_NOT_FOUND: 404,
  HTTP_409_CONFLICT: 409,
  HTTP_500_INTERNAL_SERVER_ERROR: 500,
};


class APIError extends Error {
  constructor(
    message='A server error ocurred.', 
    status=Status.HTTP_500_INTERNAL_SERVER_ERROR, 
    code='error',
  ) {
    super(message);

    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    // API error properties
    this.code = code;
    this.message = message;
    this.statusCode = status;

    Error.captureStackTrace(this, this.constructor);
  }
} 


class NotFoundError extends APIError {
  constructor(message='Not found.', code='not_found') {
    super(message, Status.HTTP_404_NOT_FOUND, code);
  }
}


class AuthenticationFailedError extends APIError {
  constructor(
    message='Incorrect authentication credentials.', 
    code='authentication_failed'
  ) {
    super(message, Status.HTTP_401_UNAUTHORIZED, code);
  }
}


class NotAuthenticatedError extends APIError {
  constructor(
    message='Authentication credentials were not provided.',
    code='not_authenticated'
  ) {
    super(message, Status.HTTP_401_UNAUTHORIZED, code);
  }
}


class PermissionDeniedError extends APIError {
  constructor(
    message='You do not have permission to perform this action.',
    code='permission_denied'
  ) {
    super(message, Status.HTTP_403_FORBIDDEN, code);
  }
}

class ConflictError extends APIError {
  constructor(
    code='conflict',
    message='The request conflicts with the current state of the target resource.',
  ) {
    super(message, Status.HTTP_409_CONFLICT, code);
  }
}


module.exports = { 
  Status,
  APIError, 
  NotFoundError, 
  AuthenticationFailedError, 
  NotAuthenticatedError,
  PermissionDeniedError ,
  ConflictError
};