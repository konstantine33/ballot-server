var _ = require('lodash');
var utilities = require('helpers/utilities');

var a =
{
    query_type: "find", //defaults to "find". Other options: "findOne", "count"
    skip: 5, //defaults to 0
    sort: "-_id", //defaults to "-_id" (ie sorts last created document first)
    limit: 10, // defaults to 10,
    select: "",
    populate: {},
    params: {}
}


module.exports = function (Schema) {
    Schema.statics.query = function Query(config) {
        var Model = this;
        var query;
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

                return data
            })
    }
};