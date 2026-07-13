export const loggerMiddleware = (req, res, next) => {
    console.log('Se autenticó ' + req.traceId + ' método:' + req.method + ' url:' + req.url)
    next()
}