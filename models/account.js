var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;
var plugins = require('helpers/model_plugins');

var model_types = require('config/model_types');

var AccountSchema = new Schema({
    authenticator: {
        type: String,
        unique: true,
        required: true,
        index: true
    },

    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        'default': "anonymous_panda"
    },

    groups: {
        type: [
            {
                type: ObjectId,
                ref: model_types.GROUP
            }
        ],
        'default': function(){return []}
    }
});

AccountSchema.plugin(plugins.metaPlugin);
AccountSchema.plugin(plugins.modelTypePlugin, model_types.ACCOUNT);
AccountSchema.plugin(plugins.showVirtuals);

module.exports = mongoose.model(model_types.ACCOUNT, AccountSchema);
