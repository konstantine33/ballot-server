module.exports = function (grunt) {
    var nodemon_ignore = ['node_modules/**/*', 'Gruntfile.js'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %>\n <%= pkg.author %>' +
                ' \n*/\n'
        },

        nodemon: {
            dev: {
                script: 'start.js',
                options: {
                    args: ['app.js'].concat(grunt.option.flags()),
                    ignore: nodemon_ignore,
                    delay: 100
                }
            },
            staging: {
                script: 'start.js',
                options: {
                    args: ['app.js', '--env=staging'].concat(grunt.option.flags()),
                    ignore: nodemon_ignore,
                    delay: 100
                }
            },
            prod: {
                script: 'start.js',
                options: {
                    args: ['app.js', '--env=production'].concat(grunt.option.flags()),
                    ignore: nodemon_ignore,
                    delay: 100
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    //running the app
    grunt.registerTask('dev', ['nodemon:dev']);
    grunt.registerTask('prod', ['nodemon:prod']);
    grunt.registerTask('staging', ['nodemon:staging']);

    //default
    grunt.registerTask('default', ['dev']);
};