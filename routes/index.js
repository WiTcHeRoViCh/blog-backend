var express = require('express');
var router = express.Router();
var posts = require('./posts');
var users = require('./users');

router.param("id", (req, res, next, id) => {
    req.userId = id;

    next();
});

router.use('/users', users);
router.use('/users/:id/posts', posts);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.json();
});

module.exports = router;
