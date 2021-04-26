const router = require("express").Router();

const signupValidator = require("../../8-validator/auth/signupValidator");
const loginValidator = require("../../8-validator/auth/loginValidator");

const {
  get_register,
  post_register,
  get_login,
  get_logout,
  get_changePassword,
  post_changePassword,
} = require("../../3-controllers/authController");

const {
  ensureAuthenticated,
  ensureNotAuthenticated,
} = require("../../2-middleware/middlewareCollection/authMiddleware");

const passport = require("passport");

router.get("/register", ensureNotAuthenticated, get_register);
router.post(
  "/register",
  ensureNotAuthenticated,
  signupValidator,
  post_register
);

router.get("/login", ensureNotAuthenticated, get_login);
// router.post("/login", isUnauthenticated, loginValidator, post_login);
router.post(
  "/login",
  ensureNotAuthenticated,
  passport.authenticate("local", {
    //successRedirect: "/profile",
    successReturnToOrRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get("/logout", ensureAuthenticated, get_logout);

router.get("/changePassword", ensureAuthenticated, get_changePassword);
router.post("/changePassword", ensureAuthenticated, post_changePassword);

module.exports = router;
