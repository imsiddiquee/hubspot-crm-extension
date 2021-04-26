const router = require("express").Router();

const orderValidator = require("../../8-validator/order/orderValidator");

const {
  get_order,
  post_order,
} = require("../../3-controllers/orderController");

const {
  isAuthenticated,
  isUnauthenticated,
} = require("../../2-middleware/middlewareCollection/authMiddleware");

router.get("/", isAuthenticated, get_order);
router.post("/", isAuthenticated, orderValidator, post_order);

module.exports = router;
