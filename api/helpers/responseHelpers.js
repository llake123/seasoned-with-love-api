const successResponse = (response, request, result, message="Success", status=200) => {
    const responseBody = {
        message: message,
        status: status,
        data: result
    }
    if(result == null) 
        response.status(404).json();
    else 
        response.status(status).json(responseBody);
}

const errorResponse = (response, request, error, status=500) => {
    const responseBody = {
        message: error,
        status: status,
        data: null
    }
    response.status(status).json(responseBody);
}

module.exports = {successResponse: successResponse, errorResponse: errorResponse}