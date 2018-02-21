import auth from "./auth";

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

const getUserPost = (req, res) => {
    const postId = req.param("id");

    Post.find({author: req.userId, _id: postId}).then( post => {
        res.json({post});
    }).catch( () => {
        res.json({success: false, message: `Post not found.`});
    });
};


router.get('/', (req, res) => {
    Post.find({author: req.userId}).then( posts => {
        return res.json({posts});
    });
});

router.get('/:id', getUserPost);

router.get('/new', auth, (req, res) => {

});

router.post('/create', auth, (req, res) => {
    const post = new Post();

    post.title = req.body.title;
    post.text = req.body.text;
    post.author = req.decoded.id;

    post.save().then( () => {
        res.json({success: true, message: "Post successfully created."});
    }).catch( err => {
        res.json({success: false, message: err.message});
    });
});

router.get('/:id/edit', auth, getUserPost);

router.patch('/:id/update', auth, (req, res) => {
    const newTitle = req.body.title;
    const newText = req.body.text;

    if (req.userId === req.decoded.id){
        Post.update({_id: req.param("id"), author: req.decoded.id}, {title: newTitle, text: newText}).then( post => {
            res.json({post});
        }).catch( err => {
            res.json({success: false, message: err});
        });
    } else {
        res.json({success: false, message: "Access denied."})
    }
});

router.delete('/:id/destroy', auth, (req, res) => {
    Post.remove({_id: req.param('id'), author: req.decoded.id}, {justOne: true}).then( () => {
        res.json({success: true, message: "Post successfully deleted."});
    }).catch( err => {
        res.json({success: false, message: err.message});
    });
});

module.exports = router;