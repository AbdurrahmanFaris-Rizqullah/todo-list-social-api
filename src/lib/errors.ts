export class AppError extends Error {
  constructor(message: string, public statusCode: number, public code?: string) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class AuthenticationError extends AppError {
    constructor(message: string = "Not authenticated") {
      super(message, 401, "AUTHENTICATION_ERROR");
    }
  }

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND_ERROR");
  }
}
