var _ = require('lodash');
var utilities = require('helpers/utilities');

module.exports = function (Schema) {
    Schema.statics.query = function Query(config) {
        var Model = this;
        var query;

        if(typeof config !== 'object'){
            config = utilities.parseJSON(config);
        }

        config.params = config.params || {};

        switch (config.query_type){
            case "findOne":
                query = Model.findOne(config.params);
                break;
            case "count":
                query = Model.count(config.params);
                break;
            default:
                query = Model.find(config.params);
        }

        query.skip(config.skip || 0);

        if(config.query_type !== 'count'){
            query.sort(config.sort || "-_id");
        }
        query.limit(config.limit || 10);

        if(config.select){
            query.select(config.select);
        }

        if(config.populate){
            query.populate(config.populate);
        }

        return query.execAsync()
            .then(function(data){
                //Can't send pure Numbers in res.send
                if(_.isNumber(data)){
                    data = data.toString();
                }
            })
    }
};