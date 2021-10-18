class AppError extends Error {

    constructor(message,statusCode) {
        // super calls the default error constructor
        super();
        this.message =  message;
        this.statusCode = statusCode;

    }


}

module.exports = AppError;