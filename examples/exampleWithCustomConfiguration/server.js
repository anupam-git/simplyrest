const simplyrest = require("simplyrest");

simplyrest.config({
    controllersPath: "apis/",
    viewsPath: "ui/",
    viewEngine: "pug",
    port: 8000
});

simplyrest.errorHandler((err, req, res, next) => {
    res.send(err.message);
});

simplyrest.use((req, res, next) => {
    console.log("Middleware called..");

    next();
});

simplyrest.listen();
