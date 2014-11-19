var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;
var plugins = require('helpers/model_plugins');

var AccountSchema = new Schema({
    authenticator: {
        type: String,
        unique: true,
        required: true
    },

    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        'default': "anonymous_panda"
    }
    //
    //groups: {
    //    type: []
    //
});

AccountSchema.plugin(plugins.metaPlugin);
AccountSchema.plugin(plugins.modelTypePlugin, "Account");
AccountSchema.plugin(plugins.showVirtuals);

module.exports = mongoose.model("Account", AccountSchema);
