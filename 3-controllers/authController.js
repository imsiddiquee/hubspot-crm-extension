const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const Flash = require("../5-utils/Flash");

const User = require("../4-models/User");
const errorFormatter = require("../5-utils/validationErrorFormatter");
const createError = require("http-errors");

exports.get_register = (req, res, next) => {
  return res.render("register", {
    title: "get_signup",
    error: {},
    data: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.post_register = async (req, res, next) => {
  let { email, password, password2 } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  try {
    if (!errors.isEmpty()) {
      req.flash("fail", "Please Check Your Form");

      const errorMessage = {
        title: "post_signup",
        error: errors.mapped(),
        data: { email, password },
        flashMessage: Flash.getMessage(req),
      };
      return res.render("register", errorMessage);
    }

    const doesExist = await User.findOne({ email: email });
    if (doesExist) {
      console.log("already exist", doesExist);
      res.redirect("/auth/register");
      return;
    }

    let user = new User({
      email,
      password: password,
    });

    await user.save();

    req.flash("success", "User Created Successfully");
    res.redirect("/auth/login");
  } catch (e) {
    next(e);
  }
};

exports.get_login = (req, res, next) => {
  return res.render("login", {
    title: "get_login",
    error: {},
    data: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.post_login = async (req, res, next) => {
  let { email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please Check Your Form");

    return res.status(400).json({
      title: "post_login",
      error: errors.mapped(),
      data: { email, password },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let user = await User.findOne({
      email,
    });
    if (!user) {
      req.flash("fail", "Please Provide Valid Credentials");

      return res.status(401).json({
        title: "post_login",
        error: errors.mapped(),
        data: { email, password },
        flashMessage: Flash.getMessage(req),
      });
    }

    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("fail", "Please Provide Valid Credentials");

      return res.status(401).json({
        title: "post_login",
        error: errors.mapped(),
        data: { email, password },
        flashMessage: Flash.getMessage(req),
      });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      req.flash("success", "Successfully Logged In");

      return res.status(200).json({
        title: "post_login",
        error: errors.mapped(),
        data: { email, password },
        flashMessage: Flash.getMessage(req),
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.get_logout = (req, res, next) => {
  req.logout();
  return res.redirect("/");
};

exports.get_changePassword = async (req, res, next) => {
  return res.status(200).json({
    title: "get_changePassword",
    error: {},
    data: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.post_changePassword = async (req, res, next) => {
  let { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    req.flash("fail", "Password Does Not Match");

    return res.status(401).json({
      title: "post_changePassword",
      error: {},
      data: { oldPassword, newPassword, confirmPassword },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let match = await bcrypt.compare(oldPassword, req.user.password);
    if (!match) {
      req.flash("fail", "Invalid Old Password");
      return res.status(401).json({
        title: "post_changePassword",
        error: {},
        data: { oldPassword, newPassword, confirmPassword },
        flashMessage: Flash.getMessage(req),
      });
    }

    let hash = await bcrypt.hash(newPassword, 11);
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { password: hash } }
    );
    req.flash("success", "Password Updated Successfully");

    return res.status(401).json({
      title: "post_changePassword",
      error: {},
      data: { oldPassword, newPassword, confirmPassword },
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};
