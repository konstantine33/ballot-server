var mongo_urls = {
    LOCAL: 'mongodb://localhost/ballot',
    PROD: 'mongodb://localhost/ballot'
};

module.exports.getUrl = function (NODE_ENV, MONGO_ENV) {
    NODE_ENV = NODE_ENV || process.env.NODE_ENV;
    MONGO_ENV = MONGO_ENV || process.env.MONGO_ENV;

    var url = NODE_ENV === 'production' ? mongo_urls.PROD : mongo_urls.LOCAL;

    if (MONGO_ENV === 'local') {
        url = mongo_urls.LOCAL;
    } else if (MONGO_ENV === 'prod') {
        url = mongo_urls.PROD;
    }

    return url;
};

module.exports.mongo_urls = mongo_urls;