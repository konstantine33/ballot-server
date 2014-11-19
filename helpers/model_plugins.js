module.exports.metaPlugin = function metaPlugin(schema) {
    schema.virtual('created_at').get(function(){
        return this._id.getTimestamp();
    })
};

module.exports.modelTypePlugin = function modelTypePlugin(schema, name) {
    schema.add({
        model_type: {
            type: String,
            select: true,
            'default': name
        }
    });
};

module.exports.showVirtuals = function showVirtuals(schema){
  schema.set('toJSON', {virtuals: true});
  schema.set('toObject', {virtuals: true});
};