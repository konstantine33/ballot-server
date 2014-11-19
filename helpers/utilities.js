var _ = require('lodash');
var ObjectId = require('mongoose').Types.ObjectId;
var TEMP = require('os').tmpdir();

module.exports.getDeepProperty = function (object, path) {
    var p = path.split('.');
    for (var i = 0, ii = p.length; i < ii; i++) {
        if (!_.isUndefined(object) && !_.isNull(object)) {
            object = object[p[i]];
        } else {
            return undefined;
        }
    }

    return object;
};

module.exports.hasDeepProperty = function (object, path) {
    var result = module.exports.getDeepProperty(object, path);
    return !_.isUndefined(result) && !_.isNull(result);
};

/**
 * Tests if one array of ids contains at least one of another
 * @param container - array of ids or objects that have attribute ._id to test against
 * @param test - array of ids or objects that have attribute ._id to check
 */
module.exports.containsId = function(container, test){
    //Forces container to be an array of ObjectIds
    container = [].concat(container).map(function(target){
        if(!target){return null;}

        var id = target._id || target;
        if(id instanceof ObjectId){
            return id
        }else {
            try{
                return new ObjectId(id)
            }catch(e){
                return null;
            }
        }
    }).filter(function(item){
        return item !== null;
    });

    test = [].concat(test).map(function(target){
        if(!target){return null;}
        return target._id || target;
    }).filter(function(item){
        return item !== null;
    });

    return container.some(function(c){
        return test.some(function(t){
            try{
                return c.equals(t)
            }
            catch(e){
                return false;
            }
        });
    })
};


module.exports.parseJSON = function (JSON_str) {
    try {
        return JSON.parse(JSON_str);
    } catch (e) {
        return {};
    }
};

module.exports.shuffleArray = function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

module.exports.addQueryString = function(url, object) {

    object = object || {};
    url = url || '';


    function update(key, value, url){

        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi");
        var hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null)
                return url.replace(re, '$1' + key + "=" + value + '$2$3');
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
        }
        else {
            if (typeof value !== 'undefined' && value !== null) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
            else
                return url;
        }
    }

    _.forIn(object, function(value, key){

        if(_.isString(value) || _.isNumber(value)){
            url = update(key, value, url);
        }
    });

    return url;
};

module.exports.preserveLineBreaks = function(msg){
    msg = msg || '';
    return msg.replace(/(?:\r\n|\r|\n)/g, '<br>');
};

module.exports.capitalize = function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.removeDuplicates = function (array) {
    return array.filter(function (elem, pos, self) {
        return self.indexOf(elem) === pos;
    });
};