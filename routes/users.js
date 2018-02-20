var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token){
      jwt.verify(token, "secret", (err, decoded) => {
          if (err){
              return res.json({ success: false, message: "Failed to authenticate token." });
          } else {
              req.decoded = decoded;
              next();
          }
      })
  }
  else {
      return res.json({success: false, message: "No token"});
  }
};

//me

/* GET users listing. */
router.get('/:id', auth,  (req, res) => {
    const userId = req.param("id");

    User.findOne({_id: userId}).then( user => {
        res.render("index", {title: user.username});
    });
});

router.post('/sign_up', function(req, res, next) {
    const user = new User();

    console.log(req.body);
    user.username = req.body.username;
    user.getSecurePassword(req.body.password);

    user.save();
});


router.post('/login', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username, password: password}).then( user => {
        const payload = {
            id: user.id
        };
        const token = jwt.sign(payload, 'secret');

        return res.json({user: user.getJSONData(), token: token});
    });


});

module.exports = router;
