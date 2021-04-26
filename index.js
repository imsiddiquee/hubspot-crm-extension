require("dotenv").config();
const express = require("express");
const setMongoAndExpressCon = require("./5-utils/init_mongodb");
const setInfoLoggerWinston = require("./2-middleware/middlewareCollection/setInfoLoggerWinston");
const setErrorLoggerWinston = require("./2-middleware/middlewareCollection/setErrorLoggerWinston");
const setViewEngine = require("./2-middleware/middlewareCollection/setViewEngine");
const setMiddleware = require("./2-middleware/index.middleware");
const setRoutes = require("./1-routes/index.route");
const setErrorRoute = require("./1-routes/routeCollection/errorRoute");

const setPassport = require("./2-middleware/middlewareCollection/setPassport");
const setLocals = require("./2-middleware/middlewareCollection/setLocals");

const app = express();

const getMessage = (req, res) => {
  let obj = {
    correlationId: req.headers["x-correlation-id"],
    requestBody: req.body,
  };
  return JSON.stringify(obj);
};

//setInfoLoggerWinston(app, getMessage, __dirname); //6-public+log

// Setup View Engine
setViewEngine(app, __dirname);

// Using Middleware from Middleware Directory
setMiddleware(app);

//set passport authentication and res local variable.
setPassport(app);
app.use(setLocals());

// Using Routes from Route Directory
setRoutes(app);
//set wisnton error logger
//setErrorLoggerWinston(app, getMessage, __dirname);
//using error handle
setErrorRoute(app);

setMongoAndExpressCon(app);
