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
let errorHandler = null, isDefaultErrorHandler = true;
let serverStarted = false;

module.exports.config = configure =  (conf) => {
    if (conf == null) {
        config = defaultConfig;
    } else {
        config = conf;
    }

    console.log("* Checking Config");

    for (let key in defaultConfig) {
        if (config[key] == null) {
            console.log("\t* Using Default    value for '"+key+"'");
            config[key] = defaultConfig[key];
        } else {
            console.log("\t* Using Configured value for '"+key+"'");
        }
    }

    config.basepath = path.dirname(module.parent.parent.filename);
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
        isDefaultErrorHandler = false;
    }
};

module.exports.listen = (port) => {
    /**** Requirements Check ****/
    
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

    console.log("\n* Setting Up Express");

    console.log("\t* Linking '"+path.join(config.basepath, "node_modules")+"' to server");
    process.env.NODE_PATH = path.join(config.basepath, "node_modules");
    require("module").Module._initPaths();

    console.log("\t* Setting Views Path to '"+path.join(config.basepath, config.viewsPath)+"'");
    app.set('views', path.join(config.basepath, config.viewsPath));

    console.log("\t* Setting Templating Engine to '"+config.viewEngine+"'");
    app.set('view engine', config.viewEngine);
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));

    console.log("\t* Adding JSON Body Parser");
    app.use(bodyParser.json());

    console.log("\t* Adding URLEncoded Body Parser");
    app.use(bodyParser.urlencoded({ extended: false }));

    console.log("\t* Adding Cookie Parser");
    app.use(cookieParser());

    console.log("\t* Setting Static Files Path to '"+path.join(config.basepath, config.publicPath)+"'");
    app.use(express.static(path.join(config.basepath, config.publicPath)));

    /*****      END Setup Express Middlewares       *****/





    /*****      Start Setup User Express Middlewares     *****/

    console.log("\n* Adding Middlewares");

    middlewares.forEach((middleware) => {
        console.log("\t* Middleware Added");
        app.use(middleware);
    });
    
    /*****      End Setup User Express Middlewares       *****/
    




    /*****      Start Setup Controllers     *****/

    console.log("\n* Parsing and Registering Controllers from '"+path.join(config.basepath, config.controllersPath)+"'");

    let controllers = fs.readdirSync(config.basepath+"/"+config.controllersPath);

    controllers.forEach((controllerPath) => {
        ControllerParser.parseAndInject(config.basepath+"/"+config.controllersPath+"/"+controllerPath, app);
    });

    /*****      End Setup Controllers       *****/





    /*****      Start Error Handlers     *****/

    app.use((req, res, next) => {
        let err = new Error("Not Found");
        err.status = 404;

        next(err);
    });

    console.log("\n* Adding "+(isDefaultErrorHandler?"Default":"Custom")+" Error Handler");

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