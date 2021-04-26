const router = require("express").Router();

const { get_cart, post_cart } = require("../../3-controllers/cartController");

const {
  isAuthenticated,
  isUnauthenticated,
} = require("../../2-middleware/middlewareCollection/authMiddleware");

router.get("/", isAuthenticated, get_cart);
router.post("/", isAuthenticated, post_cart);

module.exports = router;
