var express = require('express');
var passport = require('passport');

var BError = require('helpers/BError');
var router = express.Router();


router.post("/",
    function (req, res, next) {
        req.body.password = "none"; //must set this otherwise it complains
        if(!req.body.authenticator){
            return next(BError(400, "No authenticator provided"))
        }
        passport.authenticate('local-auth', function (err, user, info) {
            if (err) {
                return next(err);
            }

            //custom callback requires manually creating the session
            req.login(user, function (err) {
                if (err) {
                    return next(err)
                }
                return res.send(200, req.user);
            });
        })(req, res, next);
    }
);

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.send(200)
});

module.exports = router;