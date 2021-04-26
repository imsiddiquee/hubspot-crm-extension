const router = require("express").Router();

const {
  get_all_user,
  get_user,
  post_user,
  get_user_by_id,
  update_role,
} = require("../../3-controllers/userController");

const {
  ensureAuthenticated,
  ensureNotAuthenticated,
  ensureAdmin,
} = require("../../2-middleware/middlewareCollection/authMiddleware");

const { ensureLoggedIn } = require("connect-ensure-login");

router.get("/users", ensureAuthenticated, ensureAdmin, get_all_user);
router.post("/update-role", ensureAuthenticated, ensureAdmin, update_role);

router.get("/user/:id", ensureAuthenticated, ensureAdmin, get_user_by_id);
router.get("/profile", ensureAuthenticated, get_user);
router.post("/profile", post_user);

module.exports = router;
