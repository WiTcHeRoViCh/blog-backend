import auth from "./auth";
import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { secret } from '../config';
const router = express.Router();


const getUserInf = (id, res, isCurrentUser=false) => {
    const allowedFields = isCurrentUser ? {} : {_id: true, username: true, blog: true}

    User.findOne({ _id: id }, allowedFields).then( user => {
        res.json({user});
    }).catch( () => {
        res.json({success: false, message: "User not found."});
    });
};

router.get('/', (req, res) => {
    User.find({}, {_id: true, username: true, posts: true}).then( users => {
        res.json({users});
    });
});

router.get('/me', auth, (req, res) => {
    const userId = req.decoded.id;

    getUserInf(userId, res, true);
});

router.delete('/', auth, (req, res) => {
    const userId = req.decoded.id;

    User.findOne({ _id: userId }).then( user => {
        if (user) {
            User.remove({ _id: userId }, { justOne: true }).then( () => {
                res.json({ success: true, message: "User successfully deleted." });
            }).catch( err => {
                res.json({ success: false, message: err.message });
            });
        } else {
            res.json({success: false, message: "User not found."});
        }
    }).catch( err => {
        res.json({success: false, message: err.message});
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
    const {username, password} = req.body;

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

export default router;
