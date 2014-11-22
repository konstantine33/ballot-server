var mongo_urls = {
    LOCAL: 'mongodb://localhost/ballot',
    PROD: 'mongodb://localhost/ballot',
    STAGING: 'mongodb://ballot_staging:ballot_staging@dogen.mongohq.com:10049/ballot-staging'
};

module.exports.getUrl = function (NODE_ENV, MONGO_ENV) {
    NODE_ENV = NODE_ENV || process.env.NODE_ENV;
    MONGO_ENV = MONGO_ENV || process.env.MONGO_ENV;
    var url;

    switch(NODE_ENV){
        case "production":
            url = mongo_urls.PROD;
            break;
        case "staging":
            url = mongo_urls.STAGING;
            break;
        default:
            url = mongo_urls.LOCAL;
            break;
    }


    if (MONGO_ENV === 'local') {
        url = mongo_urls.LOCAL;
    } else if (MONGO_ENV === 'prod') {
        url = mongo_urls.PROD;
    } else if (MONGO_ENV === 'staging'){
        url = mongo_urls.STAGING
    }

    return url;
};

module.exports.mongo_urls = mongo_urls;