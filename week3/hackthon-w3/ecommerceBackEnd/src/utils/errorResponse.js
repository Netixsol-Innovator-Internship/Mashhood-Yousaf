class ErrorResponse extends Error {
  constructor(message = "Server Error", errorCode = 500, data = [], success = false) {
    super(message);
    this.code = errorCode;
    this.data = data;
    this.success = success;
  }
}

module.exports = ErrorResponse;
