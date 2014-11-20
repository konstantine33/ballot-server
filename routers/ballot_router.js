var express = require('express');

var router = express.Router();
var Ballot = require('models/ballot');
var BError = require('helpers/BError');

router.route("/")
    .post(function (req, res, next) {
        var ballot = new Ballot({
            creator: req.user._id,
            //group: null,
            question: req.body.question
        });

        if (req.body.end_time) {
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
        var query_config = req.query;
        query_config.params = query_config.params || {};

        //This is so that requests can only see their own polls
        query_config.params.creator = req.user._id;


        Ballot.query(query_config)
            .then(function (ballots) {
                res.send(200, ballots)
            })
            .catch(function (err) {
                next(err)
            })
    });

router.get('/responded', function (req, res, next) {
    var query_config = req.query;
    query_config.params = query_config.params || {};

    //Queries only ballots that you have responded to
    query_config.params['responses.account_id'] = req.user._id;

    Ballot.query(query_config)
        .then(function (ballots) {
            res.send(200, ballots)
        })
        .catch(function (err) {
            next(err)
        })
});

router.get('/rec', function (req, res, next) {
    var query_config = {
        limit: req.query.limit || 1,
        params: {
            'responses.account_id': {
                $nin: [req.user._id]
            }
        }
    };

    Ballot.query(query_config)
        .then(function (ballots) {
            res.send(200, ballots)
        })
        .catch(function (err) {
            next(err)
        })
});

router.param("ballot_id", function (req, res, next, ballot_id) {
    Ballot.findByIdAsync(ballot_id)
        .then(function (ballot) {
            req.ballot = ballot;
            next()
        })
        .catch(function (err) {
            next(err)
        })
});

router.post('/:ballot_id/respond', function (req, res, next) {
    var q = {
        _id: req.ballot._id,
        'responses.account_id': {
            $nin: [req.user._id]
        },
        closed: false
    };

    var response = {
        account_id: req.user._id,
        time: new Date()
    };

    var update = {
        $push: {
            responses: response
        },
        $inc: {}
    };

    switch (req.body.response){
        case "YES":
            update.$inc.yes_count = 1;
            break;
        case "NO":
            update.$inc.no_count = 1;
            break;
        case "SKIP":
            update.$inc.skip_count = 1;
            response.skipped = true;
            break;
        case "FLAG":
            update.$inc.flag_count = 1;
            response.flagged = true;
            break;
        default:
            return next(BError(400, "Invalid response"))
    }

    Ballot.findOneAndUpdateAsync(q, update)
        .then(function(result){
            if(!result){
                return next(BError(400, "Your response was not recorded because this ballot has either been closed or deleted, or you have already responded to this ballot."))
            }

            res.send(200)
        })
        .catch(function(err){
            next(err)
        })

});


module.exports = router;