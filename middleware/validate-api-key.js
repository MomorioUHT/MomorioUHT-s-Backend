module.exports = function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;
    if (!apiKey) {
        return res.status(401).json({error: 'No API key provided'})
    }
    if (apiKey !== validApiKey) {
        return res.status(403).json({error: 'Invalid API key'})
    }
    next();
}