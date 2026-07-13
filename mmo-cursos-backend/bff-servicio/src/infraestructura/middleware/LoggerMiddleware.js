export const loggerMiddleware = (req, res, next) => {
    console.log('[BFF] ' + req.traceId + ' ' + req.method + ' ' + req.url)
    next()
}