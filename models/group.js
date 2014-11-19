var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plugins = require('helpers/model_plugins');
var model_types = require('config/model_types');

var GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

GroupSchema.plugin(plugins.metaPlugin);
GroupSchema.plugin(plugins.modelTypePlugin, model_types.GROUP);
GroupSchema.plugin(plugins.showVirtuals);
GroupSchema.plugin(require('helpers/query_plugin'));

module.exports = mongoose.model(model_types.GROUP, GroupSchema);
