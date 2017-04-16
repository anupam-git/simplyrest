const {AnnotationParser} = require("nodeannotations");
const express = require("express");

module.exports.parseAndInject = function parse(controllerPath, app) {
    try {
        let annotatedElements = AnnotationParser.parse(controllerPath, __dirname+"/../annotations/");

        let controllerRoute = annotatedElements.filterBy("Controller")[0].getAnnotation("Controller").value;
        let ControllerClass = require(controllerPath);
        let Controller = new ControllerClass();

        let router = express.Router();

        annotatedElements.filterBy("Get").forEach((method) => {
            console.log("\tRegistering : GET \t"+controllerRoute+method.getAnnotation("Get").value);
            router.get("/"+method.getAnnotation("Get").value, Controller[method.name]);
        });

        annotatedElements.filterBy("Post").forEach((method) => {
            console.log("\tRegistering : POST \t"+controllerRoute+method.getAnnotation("Post").value);
            router.post("/"+method.getAnnotation("Post").value, Controller[method.name]);
        });

        annotatedElements.filterBy("Put").forEach((method) => {
            console.log("\tRegistering : PUT \t"+controllerRoute+method.getAnnotation("Put").value);
            router.put("/"+method.getAnnotation("Put").value, Controller[method.name]);
        });

        annotatedElements.filterBy("Patch").forEach((method) => {
            console.log("\tRegistering : PATCH \t"+controllerRoute+method.getAnnotation("Patch").value);
            router.patch("/"+method.getAnnotation("Patch").value, Controller[method.name]);
        });

        annotatedElements.filterBy("Delete").forEach((method) => {
            console.log("\tRegistering : DELETE \t"+controllerRoute+method.getAnnotation("Delete").value);
            router.delete("/"+method.getAnnotation("Delete").value, Controller[method.name]);
        });

        annotatedElements.filterBy("Head").forEach((method) => {
            console.log("\tRegistering : HEAD \t"+controllerRoute+method.getAnnotation("Head").value);
            router.head("/"+method.getAnnotation("Head").value, Controller[method.name]);
        });

        annotatedElements.filterBy("Options").forEach((method) => {
            console.log("\tRegistering : OPTIONS \t"+controllerRoute+method.getAnnotation("Options").value);
            router.options("/"+method.getAnnotation("Options").value, Controller[method.name]);
        });

        annotatedElements.filterBy("Trace").forEach((method) => {
            console.log("\tRegistering : TRACE \t"+controllerRoute+method.getAnnotation("Trace").value);
            router.trace("/"+method.getAnnotation("Trace").value, Controller[method.name]);
        });

        annotatedElements.filterBy("Connect").forEach((method) => {
            console.log("\tRegistering : CONNECT \t"+controllerRoute+method.getAnnotation("Connect").value);
            router.connect("/"+method.getAnnotation("Connect").value, Controller[method.name]);
        });

        annotatedElements.filterBy("All").forEach((method) => {
            console.log("\tRegistering : ALL \t"+controllerRoute+method.getAnnotation("All").value);
            router.all("/"+method.getAnnotation("All").value, Controller[method.name]);
        });
        
        annotatedElements.filterBy("Param").forEach((method) => {
            console.log("\tRegistering : PARAM \t"+method.getAnnotation("Param").value);
            router.param(method.getAnnotation("Param").value, Controller[method.name]);
        });

        app.use("/"+controllerRoute, router);
    } catch (err) {
        console.log(err);
    }
}