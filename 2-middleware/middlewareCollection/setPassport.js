const passport = require("passport");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  require("./passport.auth");
};
