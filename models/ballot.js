var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plugins = require('helpers/model_plugins');
var model_types = require('config/model_types');

var ObjectId = Schema.Types.ObjectId;

var BallotSchema = new Schema({
    creator: {
        type: ObjectId,
        ref: model_types.ACCOUNT,
        index: true
    },
    group: {
        type: ObjectId,
        ref: model_types.GROUP
    },
    question: {
        type: String,
        required: true
    },
    closed: {
        type: Boolean,
        'default': false
    },
    end_time: {
        type: Date
    },
    responses: {
        type: [
            {
                account_id: {
                    type: ObjectId,
                    ref: model_types.ACCOUNT,
                    index: true
                },
                time: Date,
                skipped: Boolean,
                flagged: Boolean
            }
        ],
        'default': []
    },
    response_count: Number,
    yes_count: Number,
    no_count: Number,
    flag_count: Number,
    skip_count: Number
});

BallotSchema.plugin(plugins.metaPlugin);
BallotSchema.plugin(plugins.modelTypePlugin, model_types.BALLOT);
BallotSchema.plugin(plugins.showVirtuals);
BallotSchema.plugin(require('helpers/query_plugin'));

module.exports = mongoose.model(model_types.BALLOT, BallotSchema);
