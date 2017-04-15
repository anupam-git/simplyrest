const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = require(__dirname+"/server/app.js");
const debug = require('debug')('server:server');
const http = require('http');
const fs = require("fs");
const ControllerParser = require(__dirname+"/ControllerParser");
const defaultConfig = require(__dirname+"/defaultConfig.json");

let middlewares = [];
let config = null;
let errorHandler = null;
let serverStarted = false;

module.exports.config = configure =  (conf) => {
    if (conf == null) {
        config = defaultConfig;
    } else {
        config = conf;
    }

    for (let key in defaultConfig) {
        if (config[key] == null) {
            config[key] = defaultConfig[key];
        }
    }

    config.basepath = path.dirname(module.parent.parent.filename);

    console.log(config);
};

module.exports.use = (middleware) => {
    if (serverStarted) {
        throw new Error("Cannot add Middleware after Server has Started");
    } else {
        middlewares.push(middleware);
    }
};

module.exports.errorHandler = (handler) => {
    if (serverStarted) {
        throw new Error("Cannot add Error Handler after Server has Started");
    } else {
        errorHandler = handler;
    }
};

module.exports.listen = (port) => {
    /**** Requirements Check ****/

    console.log("* Checking Config...");
    
    if (config == null) {
        configure(null);
    }

    if (errorHandler == null) {
        errorHandler = (err, req, res, next) => {
            res.status(err.status || 500);

            res.send(`<h1>${err.message}</h1><h2>${err.status}</h2><pre>${err.stack}</pre>`);
        };
    }

    /**** End Requirements Check ****/





    /*****      Start Setup Express Middlewares     *****/

    console.log("* Setting Up Express...");

    app.set('views', path.join(config.basepath, config.viewsPath));
    app.set('view engine', config.viewEngine);
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(config.basepath, config.publicPath)));

    /*****      END Setup Express Middlewares       *****/





    /*****      Start Setup User Express Middlewares     *****/

    console.log("* Adding Middlewares...");

    middlewares.forEach((middleware) => {
        app.use(middleware);
    });
    
    /*****      End Setup User Express Middlewares       *****/
    




    /*****      Start Setup Controllers     *****/

    console.log("* Parsing and Registering Controllers...");

    let controllers = fs.readdirSync(config.basepath+"/"+config.controllersPath);

    controllers.forEach((controllerPath) => {
        ControllerParser.parseAndInject(config.basepath+"/"+config.controllersPath+"/"+controllerPath, app);
    });

    /*****      End Setup Controllers       *****/





    /*****      Start Error Handlers     *****/

    /**
     * TODO:
     * - [x] Support for Error Handlers
     */

    app.use((req, res, next) => {
        let err = new Error("Not Found");
        err.status = 404;

        next(err);
    });

    app.use(errorHandler);

    /*****      End Error Handlers       *****/





    app.set('port', normalizePort(port || config.port));

    let server = http.createServer(app);

    console.log("\n* Starting Server...");

    server.listen(port || config.port);
    server.on('error', onError);
    server.on('listening', onListening);

    serverStarted = true;

    function normalizePort(val) {
        let port = parseInt(val, 10);

        if (isNaN(port)) { return val; }

        if (port >= 0) { return port; }

        return false;
    }

    function onError(error) {
        if (error.syscall !== 'listen') { throw error; }

        let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    function onListening() {
        let addr = server.address();
        let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

        console.log("\tListening on " + bind + "\n");
    }
};