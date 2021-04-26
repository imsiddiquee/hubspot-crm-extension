const router = require("express").Router();

const {
  get_products,
  post_products,
  get_product_by_id,
  update_product_by_id,
  delete_product_by_id,
} = require("../../3-controllers/productController");

router.get("/", get_products);
router.post("/", post_products);
router.get("/:id", get_product_by_id);
router.patch("/:id", update_product_by_id);
router.delete("/:id", delete_product_by_id);

module.exports = router;
