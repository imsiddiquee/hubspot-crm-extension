const express = require("express");
const limitter = require("express-rate-limit");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const responseTime = require("response-time");

const MongoDBStore = require("connect-mongodb-session")(session);
const { DB_URI } = require("../5-utils/util");

const {
  bindUserWithRequest,
} = require("./middlewareCollection/authMiddleware");
const setLocals = require("./middlewareCollection/setLocals");
const setCorrelation = require("./middlewareCollection/setCorrelation");

const store = new MongoDBStore({
  uri: DB_URI,
  databaseName: "rbacDB",
  collection: "sessions",
  expires: 1000 * 60 * 60 * 2,
});

const middleware = [
  // globally configure prevent, brute-force attack
  limitter({
    windowMs: 5000,
    max: 5,
    message: { code: 429, message: "Too many request!" },
  }),
  responseTime(),
  morgan("dev"),
  express.static("6-public"),

  //used to read data from view-form
  express.urlencoded({
    extended: true,
  }),
  //used to read data from json body request.
  express.json(),

  session({
    secret: process.env.SESSION_SECTET_KEY || "SECTET_KEY", //config.get("secret"),
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      //only work on https server.cookie transfer only https protocol.
      //secure:true
      httpOnly: true, //
    },
  }),

  flash(),
  //bindUserWithRequest(),
  //setLocals(),
  setCorrelation(),
];

module.exports = (app) => {
  middleware.forEach((m) => {
    app.use(m);
  });
};
