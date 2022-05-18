export class ApplicationError extends Error {
  constructor(
    statusCode = 500,
    message = 'Ops... algo deu errado. Tente novamente mais tarde.'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}
