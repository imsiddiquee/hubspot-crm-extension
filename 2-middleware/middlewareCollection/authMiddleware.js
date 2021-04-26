const User = require("../../4-models/Post");
const Flash = require("../../5-utils/Flash");
const { ensureLoggedOut, ensureLoggedIn } = require("connect-ensure-login");
const { roles } = require("../../5-utils/constants");

exports.bindUserWithRequest = () => {
  return async (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return next();
    }
    try {
      let user = req.session.user; //await User.findById(req.session.user._id).exec();//TODO:need to fix later
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

exports.isAuthenticated = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.flash("fail", "Unauthorized route!");

    return res.status(401).json({
      title: "Unauthorized",
      error: { message: "unauthorized route" },
      data: {},
      flashMessage: Flash.getMessage(req),
    });
    // return res.redirect("/auth/login");
  }
  next();
};

///set un-authenticated and also set authenticated default route
exports.isUnauthenticated = (req, res, next) => {
  if (req.session.isLoggedIn) {
    //return res.redirect("/dashboard");
  }
  next();
};

exports.setUnAuthenticatedDefaultRoute = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/dashboard");
  }
};

exports.ensureAdmin = (req, res, next) => {
  if (req.user.role === roles.admin) {
    next();
  } else {
    req.flash("error", "You are not authorized to see the route");
    res.redirect("/");
  }
};
//ensureLoggedIn({ redirectTo: "/auth/login" })
// exports.ensureAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect("/auth/login");
//   }
// };

//ensureLoggedOut({ redirectTo: "/" })
// exports.ensureNotAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return res.redirect("back");
//   } else {
//     next();
//   }
// };

exports.ensureAuthenticated = ensureLoggedIn({ redirectTo: "/auth/login" });

exports.ensureNotAuthenticated = ensureLoggedOut({ redirectTo: "/" });
