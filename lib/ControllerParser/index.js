const {AnnotationParser} = require("nodeannotations");
const express = require("express");

module.exports.parseAndInject = function parse(controllerPath, app) {
    try {
        let annotatedElements = AnnotationParser.parse(controllerPath, __dirname+"/../annotations/");

        let controllerName = annotatedElements.filterBy("Controller")[0].name;
        let ControllerClass = require(controllerPath);
        let Controller = new ControllerClass();

        let router = express.Router();

        // TODO : Implement All HTTP METHODS

        annotatedElements.filterBy("Get").forEach((method) => {
            console.log("\tRegistering : "+controllerName+method.annotations[0].value);
            router.get(method.annotations[0].value, Controller[method.name]);
        });

        app.use("/"+controllerName, router);
    } catch (err) {
        console.log(err);
    }
}