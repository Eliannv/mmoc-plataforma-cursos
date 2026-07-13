export const timeMiddleware = (req, res, next) => {
    const inicio = Date.now()
    res.on('finish', () => {
        const duracion = (Date.now() - inicio) / 1000
        console.log('El id:' + req.traceId + ' respondió ' + duracion + 'ms\n')
    })
    next()
}