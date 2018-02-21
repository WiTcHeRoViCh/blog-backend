import auth from "./auth";

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;


const getUserInf = (id, res, isCurrentUser=false) => {
    const allowedFields = isCurrentUser ? {} : {_id: true, username: true, blog: true}

    User.findOne({_id: id}, allowedFields).then( user => {
        res.json({user});
    }).catch( () => {
        res.json({success: false, message: "User not found."});
    });
};

router.get('/', (req, res) => {
    User.find({}, {_id: true, username: true, posts: true}).then( users => {
       res.json({users: users});
    });
});

router.get('/me', auth, (req, res) => {
   const userId = req.decoded.id;

   getUserInf(userId, res, true);
});

router.delete('/delete_current_user', auth, (req, res) => {
    const userId = req.decoded.id;

    User.remove({_id: userId}, {justOne: true}).catch( err => {
        res.json({success: false, message: err});
    });
});

router.get('/:id',  (req, res) => {
    const userId = req.param("id");

    getUserInf(userId, res);
});

/* Sign up, login, logout path */
router.post('/sign_up', (req, res) => {
    const user = new User();

    user.username = req.body.username;
    user.password = req.body.password;

    user.save().then( () => {
        res.json({success: true, message: "User successfully created."});
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username, password}).then( user => {
        const payload = {
            id: user.id
        };
        const token = jwt.sign(payload, secret);

        res.json({user, token});
    }).catch( () => {
        res.json({success: false, message: "User not found."});
    });
});

router.delete('/logout', (req, res) => {
    const token = "";

    res.json({token});
});

module.exports = router;
