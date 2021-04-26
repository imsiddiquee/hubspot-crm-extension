const router = require("express").Router();

const {
  post_tierOne,
  get_tierOne,
  get,
} = require("../../3-controllers/tierOneController");

const {
  get_a_line_item_by_id,
  post_get_a_group_of_line_items_by_id,
  get_tierone_company_carrier,
} = require("../../9-services/tierOneService");

router.get("/", get_tierOne);
router.post("/", post_tierOne);
router.get("/get_a_line_item_by_id/:id", get_a_line_item_by_id);
router.post(
  "/post_get_a_group_of_line_items_by_id",
  post_get_a_group_of_line_items_by_id
);

router.get("/get_tierone_company_carrier", get_tierone_company_carrier);

module.exports = router;
