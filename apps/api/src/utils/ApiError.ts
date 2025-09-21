export class ApiError extends Error {
  statusCode: number;
  success: boolean;

  constructor(statusCode: number, message = "Something went wrong") {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.success = false;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      name: this.name,
      message: this.message,
    };
  }
}
