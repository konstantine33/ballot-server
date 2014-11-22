#!/usr/bin/env node

'use strict';

var forever = require('forever-monitor');
var argv = require('minimist')(process.argv.slice());
var _ = require('lodash');

var script = argv._[2];
var restricted_props = ["_", "env"];

function getEnvironment (){
    var key = argv.env;

    if(key === "production"){
        return "production";
    }else if (key === "staging"){
        return "staging"
    }

    return "development"
}

function getRestarts(){
    var env = getEnvironment();
    if(env == "development"){
        return 0;
    }

    return 2;
}

var child = new (forever.Monitor)(script,{
    max: getRestarts() + 1, //Number of times script is allowed to execute
    killTree: true,
    cwd: __dirname,
    env: (function() {
        process.env.NODE_ENV = getEnvironment();
        process.env.NODE_PATH = "."; // Enables require() calls relative to the cwd :)

        return process.env;
    })(),
    options: (function(){
        var args = _.clone(argv);
        restricted_props.forEach(function(prop){
            delete args[prop];
        });

        var opts = [];
        _.forIn(args, function(value, key){
            opts.push("--" + key +"=" +value);
        });

        return opts;
    })()
});

child.on('restart', function() {
    console.error(script + ' is restarting. This script has now been executed: ' + child.times);
});

child.on('exit', function () {
    var restarts = getRestarts();
    if(restarts){
        console.log(script + ' has exited after restarting the server %d additional times', getRestarts());
    }else {
        console.log(script + ' has exited');
    }
});

child.start();