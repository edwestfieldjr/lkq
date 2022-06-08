class HttpError extends Error {
    constructor(message, errorCode=500) {
        super(message);
        this.code = errorCode;
    }

}

module.exports = HttpError;