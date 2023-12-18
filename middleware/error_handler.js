const errorHandler = (err, req, res, next) => {
    if(err.name === 'notFound') {
        res.status(404).json({message: 'Not Found Brother'})
    }

}

module.exports = errorHandler;