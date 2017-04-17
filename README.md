![Logo](https://gist.githubusercontent.com/anupam-git/f9960010f1ec112b9666d3eb656828a2/raw/ee80cf3b8ee5d598d3b30042d1ca59037632b6f6/simplyrest.png)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/anupam-git/simplyrest/master/LICENSE) [![npm version](https://badge.fury.io/js/simplyrest.svg)](https://badge.fury.io/js/simplyrest) [![GitHub stars](https://img.shields.io/github/stars/anupam-git/simplyrest.svg)](https://github.com/anupam-git/simplyrest/stargazers)


`simplyrest` is a REST API Framework based on ExpressJS. `simplyrest` uses [`nodeannotations`](https://github.com/anupam-git/nodeannotations) library to provide hassle-free and easy way to expose REST APIs via Annotations.

To Expose a REST API, create a controller class and annotate with the predefined annotations.

Find complete examples in the [`example`](#) folder.


# Table Of Contents
* [Tutorial](#tutorial)
    * [Installing simplyrest](#installing-simplyrest)
    * [Configuring simplyrest](#configuring-simplyrest)
    * [Creating a Controller](#creating-a-controller)
        * [Supported HTTP Methods](#supported-http-methods)
        * [Support for `router.param`](#support-for-routerparam)
    * [Adding Middlewares](#adding-middlewares)
    * [Adding Templating Engine](#adding-templating-engine)
    * [Adding Error Handler](#adding-error-handler)
    * [Starting simplyrest Server](#starting-simplyrest-server)
* [Examples](#examples)
* [Documentation](#documentation)
    * [simplyrest.config(options)](#simplyrestconfigoptions)
    * [simplyrest.use(middleware)](#simplyrestusemiddleware)
    * [simplyrest.errorHandler(handler)](#simplyresterrorhandlerhandler)
    * [simplyrest.listen([, port])](#simplyrestlisten-port)


# Tutorial

### Installing simplyrest
    npm install --save simplyrest


### Configuring simplyrest
```javascript
let options = {
    // Put your options here
};

simplyrest.config(options);
```


### Creating a Controller
* **Step 1** : Create a file under the `[project root]/controllers` folder (or the custom configured controllers folder)

* **Step 2** : Create a class and Annotate with `@Controller`
    ```javascript
    /**
     * @Controller("/")
     */
    class MyController {

    }
    ```
    **__NOTE :__**
    * Annotations should be defined as shown above.    
    * URLs should contain trailing slashes and not leading slashes

* **Step 3** : Create functions and annotate with supported HTTP Method to expose it as a REST API.
    ```javascript
    /**
    * @Controller("/")
    */
    class MyController {
        /**
         * @Get("/")
         */
        rootMethod(req, res, next) {
            res.send("Welcome");
        }

        /**
         * @Get("helloWorld/")
         */
        helloWorld(req, res, next) {
            res.send("Hello World");
        }
    }
    ```
    **__NOTE__** :
    * Annotations should be defined as shown above.
    * Method can be named according to choice.
    * `simplyrest` expects the method signature to be (req, res, next) just like ExpressJS Router Methods.
    * URLs should contain trailing slashes and not leading slashes.


#### Supported HTTP Methods
* __GET__ : @Get(url)
* __POST__ : @Post(url)
* __PUT__ : @Put(url)
* __PATCH__ : @Patch(url)
* __DELETE__ : @Delete(url)
* __HEAD__ : @Head(url)
* __OPTIONS__ : @Options(url)
* __TRACE__ : @Trace(url)
* __CONNECT__ : @Connect(url)
* __ALL__ : @All(url)


#### Support for `router.param`
`router.param` functionality is supported via `@Param(paramName)` Annotation.  
__**Example**__ : 
```javascript
/**
 * @Controller("/")
 */
class MyController {
    /**
     * @Get("/printName/:name")
     */
    rootMethod(req, res, next) {
        res.send("Welcome "+req.params.name);
    }

    /**
     * @Param("name")
     */
    paramNameHandler(req, res, next) {
        console.log("Route with Param name called...");

        next();
    }
}
```


### Adding Middlewares
To add a middleware, call the [`use`](#simplyrestusemiddleware) function with an **Express Middleware**.
```javascript
simplyrest.use((req, res, next) => {
    console.log("Middleware called");
});
```


### Adding Templating Engine
Any Templating Engine can be used to render the templates.
* **Step 1** : Install the Templating engine  
```npm install --save pug```
* **Step 2** : Configure the view engine by setting [`viewEngine`](#simplyrestconfigoptions) to `pug` in the [`options`](#simplyrestconfigoptions).
```javascript
let options = {
    [...]
    "viewEngine": "pug",
    [...]
};

simplyrest.config(options);
```


### Adding Error Handler
To add an error handler, call the [`errorHandler`](#simplyresterrorhandlerhandler) function with an **Express Error Handler**.
```javascript
simplyrest.errorHandler((err, req, res, next) => {
    res.send(err.message);
});
```

If no error handler is supplied, by default an error handler is attached with the server which will display the error status, error message and error stack. The following error handler is added by default :
```javascript
(err, req, res, next) => {
    res.status(err.status || 500);

    res.send(`<h1>${err.message}</h1><h2>${err.status}</h2><pre>${err.stack}</pre>`);
};
```


### Starting simplyrest Server
The simplyrest Server can be started by calling the [`listen`](#simplyrestlisten-port) function.

The server will listen on `port` provided via [`options`](#simplyrestconfigoptions) if no argument is passed while calling `listen()`. If port is not configured via options, then the server will listen on the default port `3000`.
```javascript
simplyrest.listen();
```

The server will listen on `port` provided via argument even when the port is configured via [`options`](#simplyrestconfigoptions).
```javascript
simplyrest.listen(8080);
```


# Examples
Find two complete examples in the [`examples`](./examples) folder.


# Documentation

### simplyrest.config(options)
* `options` [&lt;Object&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    * `controllersPath` : Relative Path to Controllers Folder
        * **Type** : [&lt;string&gt;][MDNString]
        * **Default** : `"/controllers"`
    * `viewsPath` : Relative Path to Views Folder
        * **Type** : [&lt;string&gt;][MDNString]
        * **Default** : `"/views"`
    * `publicPath` : Relative Path to Public Folder
        * **Type** : [&lt;string&gt;][MDNString]
        * **Default** : `"/public"`
    * `viewEngine` : Templating engine to Render the Templates
        * **Type** : [&lt;string&gt;][MDNString]
        * **Default** : `"ejs"`
    * `port` Port on which the server will listen
        * **Type** : [&lt;integer&gt;][MDNInteger]
        * **Default** : `3000`


### simplyrest.use(middleware)
* `middleware` : Expects an Express Middleware
    * **Type** : [&lt;Function&gt;][MDNFunction]


### simplyrest.errorHandler(handler)
* `handler` : Expects an Express Error Handler
    * **Type** : [&lt;Function&gt;][MDNFunction]


### simplyrest.listen([, port])
* `port` : Port on which the server will listen
    * **Type** : [&lt;integer&gt;][MDNInteger]
    * **Optional**



[MDNString]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[MDNInteger]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[MDNFunction]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function