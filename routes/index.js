import express from 'express';
import posts from './posts';
import users from './users';
const router = express.Router();

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
