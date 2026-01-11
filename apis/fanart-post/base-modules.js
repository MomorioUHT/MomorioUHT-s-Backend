module.exports = (pool) => ({
    posts: require('./get-posts')(pool),
    post: require('./get-single-post')(pool),
    create: require('./create-posts')(pool)
});