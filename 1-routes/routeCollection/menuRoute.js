const router = require("express").Router();

const menuValidator = require("../../8-validator/menu/menuValidator");

const { get_menu, post_menu } = require("../../3-controllers/menuController");

const {
  isAuthenticated,
  isUnauthenticated,
} = require("../../2-middleware/middlewareCollection/authMiddleware");

router.get("/", isAuthenticated, get_menu);
router.post("/", isAuthenticated, menuValidator, post_menu);

module.exports = router;
