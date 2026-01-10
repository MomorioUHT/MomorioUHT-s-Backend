module.exports = (pool) => ({
    posts: require('./get-posts')(pool),
    create: require('./create-posts')(pool)
});