Installing Server Components
--------

1. Clone the repository:
    ```
    $ git clone https://github.com/renovatd/constant-home
    ```

2. Install Node (if you don't have it): http://nodejs.org/download/

3. Install MongoDB (if you don't have it): https://www.mongodb.org/

3. Install Redis (if you don't have it): http://redis.io/
NOTE: Please follow the special instructions for WINDOWS on the download page

4. Install all the packages in `packages.json` via NPM:
    ```
    $ npm install
    ```

5. Install Grunt CLI globally (if you don't have it):
    ```
    $ npm install -g grunt-cli
    ```

7. Install a MongoDB Database viewer (if you don't have it; RoboMongo is recommended)


Starting the Server
----------------------

###Development###
Prior to starting you must have `redis-server` and `mongod` running on their respective default localhost port.

You can start the server using: `grunt dev`


###Production###
You must have `redis-sever` running on the default localhost port.

You can start the server using: `grunt prod`


Start Script
-------------
The start script allows you to start any file using same the environment setup for the server. This low-level command
is hidden by Grunt when starting up servers. The startup script provides for:

- Allows `require` commands relative to the current working directory
- Utilizes Forever Monitor to handle restarting the script if it crashes

Note that Nodemon support is not provided for this low level runner. The script will not restart on file changes and
must be rerun.

####Usage Syntax
`node start path_to_file --flags`


####Available Flags:

#####Node Environment: `--env=`
Sets `process.env.NODE_ENV`. Default: `development`<br>
Other valid options: `production`

#####MongoDB Environment: `--mongo=`
Sets `process.env.MONGO_ENV`. No default value.<br>
Valid options: `local`, `prod`

You can use this in conjunction with `require('config/mongo').getUrl()` to retrieve a mongo URL based on `NODE_ENV` and `MONGO_ENV`.
If `--mongo` is not specified, the returned url points to your `local` mongo for `NODE_ENV = development` and
the production mongo for `NODE_ENV = production`. If `--mongo` flag is set, it will override any behavior based on `NODE_ENV` and
set the url to whatever is specified.

#####Custom forever-monitor restarts: `--restarts=`
Sets number of times forever-monitor will attempt restart the script if the script should crash due to an unhandled error.<br>
Defaults to: `0` for development and `2` for production.

Developer Notes
---------------
We use forever-monitor 1.2.x only because in 1.3.0, you are unable to kill child process with control-c.
https://github.com/nodejitsu/forever-monitor/issues/80