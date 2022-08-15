function errorResponse(res, message, statusCode = 500, error = {}) {
    res.status(statusCode).json({
        success: false,
        message,
        error: {
            statusCode,
            message,
            error,
        },
    });
};

function missing(res, errors) {
    errorResponse(res, "Missing Fields or Empty", 400, errors.array({onlyFirstError: true}))
}

module.exports = {errorResponse, missing}
