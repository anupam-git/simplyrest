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

let config = null;

module.exports.config = (conf) => {
    // TODO : Implement Default Config Values if not specified
    
    config = conf;
    config.basepath = path.dirname(module.parent.parent.filename);
};

module.exports.listen = (port) => {
    /**** Requirements Check ****/

    console.log("* Checking Config...");
    
    if (config == null) {
        throw new Error("Config not supplied");
    }

    /**** End Requirements Check ****/





    /*****      Start Setup Express Middlewares     *****/

    console.log("* Setting Up Express...");

    // TODO : Setup Dynamic configuration from config

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    /*****      END Setup Express Middlewares       *****/





    /*****      Start Setup User Express Middlewares     *****/

    console.log("* Adding Middlewares...");

    // TODO : Implement Middleware Functionality
    
    /*****      End Setup User Express Middlewares       *****/
    




    /*****      Start Setup Controllers     *****/

    console.log("* Parsing and Registering Controllers...");

    let controllers = fs.readdirSync(config.basepath+"/"+config.controllersPath);

    controllers.forEach((controllerPath) => {
        ControllerParser.parseAndInject(config.basepath+"/"+config.controllersPath+"/"+controllerPath, app);
    });

    /*****      End Setup Controllers       *****/





    app.set('port', normalizePort(port || '3000'));

    let server = http.createServer(app);

    console.log("\n* Starting Server...");

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

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

        console.log("\tListening on " + bind)
    }
};