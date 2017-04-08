const {AnnotationParser} = require("nodeannotations");
const express = require("express");

module.exports.parseAndInject = function parse(controllerPath, app) {
    try {
        let annotatedElements = AnnotationParser.parse(controllerPath, __dirname+"/../annotations/");

        let controllerRoute = annotatedElements.filterBy("Controller")[0].annotations[0].value;
        let ControllerClass = require(controllerPath);
        let Controller = new ControllerClass();

        let router = express.Router();

        /**
         * TODO:
         * - [x] Support Major HTTP Methods
         * - [x] Add Support for router.param()
         * - [x] Support for Multilevel Routing
         * - [x] Controller Path to be registered from @Controller() annotation
         */

        annotatedElements.filterBy("Get").forEach((method) => {
            console.log("\tRegistering : GET \t"+controllerRoute+method.annotations[0].value);
            router.get("/"+method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Post").forEach((method) => {
            console.log("\tRegistering : POST \t"+controllerRoute+method.annotations[0].value);
            router.post("/"+method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Put").forEach((method) => {
            console.log("\tRegistering : PUT \t"+controllerRoute+method.annotations[0].value);
            router.put("/"+method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Patch").forEach((method) => {
            console.log("\tRegistering : PATCH \t"+controllerRoute+method.annotations[0].value);
            router.patch("/"+method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Delete").forEach((method) => {
            console.log("\tRegistering : DELETE \t"+controllerRoute+method.annotations[0].value);
            router.delete("/"+method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Head").forEach((method) => {
            console.log("\tRegistering : HEAD \t"+controllerRoute+method.annotations[0].value);
            router.head("/"+method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Options").forEach((method) => {
            console.log("\tRegistering : OPTIONS \t"+controllerRoute+method.annotations[0].value);
            router.options("/"+method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Trace").forEach((method) => {
            console.log("\tRegistering : TRACE \t"+controllerRoute+method.annotations[0].value);
            router.trace("/"+method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("Connect").forEach((method) => {
            console.log("\tRegistering : CONNECT \t"+controllerRoute+method.annotations[0].value);
            router.connect("/"+method.annotations[0].value, Controller[method.name]);
        });

        annotatedElements.filterBy("All").forEach((method) => {
            console.log("\tRegistering : ALL \t"+controllerRoute+method.annotations[0].value);
            router.all("/"+method.annotations[0].value, Controller[method.name]);
        });
        
        annotatedElements.filterBy("Param").forEach((method) => {
            console.log("\tRegistering : PARAM \t"+method.annotations[0].value);
            router.param(method.annotations[0].value, Controller[method.name]);
        });

        app.use(controllerRoute, router);
    } catch (err) {
        console.log(err);
    }
}