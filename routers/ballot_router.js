var express = require('express');

var router = express.Router();
var Ballot = require('models/ballot');

router.route("/")
    .post(function (req, res, next) {
        var ballot = new Ballot({
            creator: req.user._id,
            //group: null,
            question: req.body.question
        });

        if(req.body.end_time){
            ballot.end_time = new Date(req.body.end_time)
        }

        ballot.saveAsync()
            .then(function (results) {
                res.send(200)
            })
            .catch(function (err) {
                next(err)
            })
    })
    .get(function (req, res, next) {
        //TEMPORARY
        Ballot.findAsync({creator: req.user._id})
            .then(function(ballots){
                res.send(200, ballots)
            })
            .catch(function(err){
                next(err)
            })
    });


module.exports = router;