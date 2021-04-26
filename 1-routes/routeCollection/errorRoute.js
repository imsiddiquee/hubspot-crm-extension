const chalk = require("chalk");
const createError = require("http-errors");

module.exports = (app) => {
  app.use((req, res, next) => {
    next(createError.NotFound());
  });

  //handle error
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    if (req.path.toLowerCase().includes("api")) {
      res.send({
        status: error.status || 500,
        message: error.message,
      });
    } else {
      res.render("error_40x", { error });
    }
  });
};
