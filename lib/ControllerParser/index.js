const {AnnotationParser} = require("nodeannotations");
const express = require("express");
const path = require("path");

module.exports.parseAndInject = function parse(controllerPath, app) {
    try {
        let annotatedElements = AnnotationParser.parse(controllerPath, __dirname+"/../annotations/");

        let controllerRoute = annotatedElements.filterBy("Controller")[0].getAnnotation("Controller").value;
        let ControllerClass = require(controllerPath);
        let Controller = new ControllerClass();

        let router = express.Router();

        annotatedElements.filterBy("Get").forEach((method) => {
            console.log("\tRegistering : GET \t"+path.join(controllerRoute, method.getAnnotation("Get").value));
            router.get(path.join("/", method.getAnnotation("Get").value), Controller[method.name]);
        });

        annotatedElements.filterBy("Post").forEach((method) => {
            console.log("\tRegistering : POST \t"+path.join(controllerRoute, method.getAnnotation("Post").value));
            router.post(path.join("/", method.getAnnotation("Post").value), Controller[method.name]);
        });

        annotatedElements.filterBy("Put").forEach((method) => {
            console.log("\tRegistering : PUT \t"+path.join(controllerRoute, method.getAnnotation("Put").value));
            router.put(path.join("/", method.getAnnotation("Put").value), Controller[method.name]);
        });

        annotatedElements.filterBy("Patch").forEach((method) => {
            console.log("\tRegistering : PATCH \t"+path.join(controllerRoute, method.getAnnotation("Patch").value));
            router.patch(path.join("/", method.getAnnotation("Patch").value), Controller[method.name]);
        });

        annotatedElements.filterBy("Delete").forEach((method) => {
            console.log("\tRegistering : DELETE \t"+path.join(controllerRoute, method.getAnnotation("Delete").value));
            router.delete(path.join("/", method.getAnnotation("Delete").value), Controller[method.name]);
        });

        annotatedElements.filterBy("Head").forEach((method) => {
            console.log("\tRegistering : HEAD \t"+path.join(controllerRoute, method.getAnnotation("Head").value));
            router.head(path.join("/", method.getAnnotation("Head").value), Controller[method.name]);
        });

        annotatedElements.filterBy("Options").forEach((method) => {
            console.log("\tRegistering : OPTIONS \t"+path.join(controllerRoute, method.getAnnotation("Options").value));
            router.options(path.join("/", method.getAnnotation("Options").value), Controller[method.name]);
        });

        annotatedElements.filterBy("Trace").forEach((method) => {
            console.log("\tRegistering : TRACE \t"+path.join(controllerRoute, method.getAnnotation("Trace").value));
            router.trace(path.join("/", method.getAnnotation("Trace").value), Controller[method.name]);
        });

        annotatedElements.filterBy("Connect").forEach((method) => {
            console.log("\tRegistering : CONNECT \t"+path.join(controllerRoute, method.getAnnotation("Connect").value));
            router.connect(path.join("/", method.getAnnotation("Connect").value), Controller[method.name]);
        });

        annotatedElements.filterBy("All").forEach((method) => {
            console.log("\tRegistering : ALL \t"+path.join(controllerRoute, method.getAnnotation("All").value));
            router.all(path.join("/", method.getAnnotation("All").value), Controller[method.name]);
        });
        
        annotatedElements.filterBy("Param").forEach((method) => {
            console.log("\tRegistering : PARAM \t"+method.getAnnotation("Param").value);
            router.param(method.getAnnotation("Param").value, Controller[method.name]);
        });

        app.use(path.join("/", controllerRoute), router);
    } catch (err) {
        console.log(err);
    }
}