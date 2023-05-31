//!handle errors
module.exports = (err, req, res) => {
    const errorCodes = {
        CastError: {
            code: 400,
            message: 'not a valid id'
        },
        ReferenceError: {
            code: 404,
            message: 'id does not exist'
        },
        MissingSchemaError: {
           code: 500,
           message: 'any comments yet' 
        },
        default: {
            code: 500,
            message: 'something failed'
        }
    }

    const currentError = errorCodes[err.name] 
        ? errorCodes[err.name] 
        : errorCodes.default

    console.log(currentError.message)
    res.status(currentError.code).send({
        error: currentError.message,
        name: err.name
    })   
}