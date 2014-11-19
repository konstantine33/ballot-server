module.exports = function(statusCode, errorMessage, data){
    return {
        name: 'BallotError',
        status: statusCode,
        message: errorMessage,
        data: data
    }
};