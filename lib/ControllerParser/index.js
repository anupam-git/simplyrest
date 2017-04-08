const {AnnotationParser} = require("nodeannotations");
const express = require("express");

module.exports.parseAndInject = function parse(controllerPath, app) {
    try {
        let annotatedElements = AnnotationParser.parse(controllerPath, __dirname+"/../annotations/");

        let controllerName = annotatedElements.filterBy("Controller")[0].name;
        let ControllerClass = require(controllerPath);
        let Controller = new ControllerClass();

        let router = express.Router();

        /**
         * TODO:
         * - [x] Support Major HTTP Methods
         * - [ ] Add Support for router.param()
         * - [ ] Support for Multilevel Routing
         */

        annotatedElements.filterBy("Get").forEach((method) => {
            console.log("\tRegistering : GET \t/"+controllerName+method.annotations[0].value);
            router.get(method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Post").forEach((method) => {
            console.log("\tRegistering : POST \t/"+controllerName+method.annotations[0].value);
            router.post(method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Put").forEach((method) => {
            console.log("\tRegistering : PUT \t/"+controllerName+method.annotations[0].value);
            router.put(method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Patch").forEach((method) => {
            console.log("\tRegistering : PATCH \t/"+controllerName+method.annotations[0].value);
            router.patch(method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Delete").forEach((method) => {
            console.log("\tRegistering : DELETE \t/"+controllerName+method.annotations[0].value);
            router.delete(method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Head").forEach((method) => {
            console.log("\tRegistering : HEAD \t/"+controllerName+method.annotations[0].value);
            router.head(method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Options").forEach((method) => {
            console.log("\tRegistering : OPTIONS \t/"+controllerName+method.annotations[0].value);
            router.options(method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Trace").forEach((method) => {
            console.log("\tRegistering : TRACE \t/"+controllerName+method.annotations[0].value);
            router.trace(method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Connect").forEach((method) => {
            console.log("\tRegistering : CONNECT \t/"+controllerName+method.annotations[0].value);
            router.connect(method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("All").forEach((method) => {
            console.log("\tRegistering : ALL \t/"+controllerName+method.annotations[0].value);
            router.all(method.annotations[0].value, Controller[method.name]);
        });

        app.use("/"+controllerName, router);
    } catch (err) {
        console.log(err);
    }
}