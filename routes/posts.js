import auth from "./auth";
import express from 'express';
import Post from '../models/Post';
const router = express.Router();

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

router.post('/', auth, (req, res) => {
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

router.patch('/:id', auth, (req, res) => {
    const { title, text } = req.body.text;

    if (req.userId === req.decoded.id){
        Post.update({_id: req.param("id"), author: req.decoded.id}, {title, text}).then( post => {
            res.json({success: true, message: "Post successfully updated"});
        }).catch( err => {
            res.json({success: false, message: err.message});
        });
    } else {
        res.json({ success: false, message: "Access denied." });
    }
});


router.delete('/:id', auth, (req, res) => {
    Post.findOne({ _id: req.param('id'), author: req.decoded.id }).then( post => {
        if (post){
            Post.remove({_id: req.param('id'), author: req.decoded.id}).then((s) => {
                res.json({success: true, message: "Post successfully deleted."});
            }).catch(err => {
                res.json({success: false, message: err.message})
            });
        } else {
            res.json({ success: false, message: "Post not found." });
        }
    }).catch( err => {
        res.json({ success: false, message: err.message });
    });
});

export default router;