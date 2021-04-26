//const ejs = require("ejs");
const path = require("path");
//const expressLayout = require("express-ejs-layouts");

module.exports = (app, dirname) => {
  //app.use(expressLayout);
  app.set("views", path.join(dirname, "/7-views/"));
  app.set("view engine", "ejs");
};
