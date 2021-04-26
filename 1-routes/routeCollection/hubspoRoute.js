const router = require("express").Router();

const {
  get_a_line_item_by_id,
  post_get_a_group_of_line_items_by_id,
} = require("../../3-controllers/hubspotLineItemController");

const {
  get_company_to_deal,
  get_deal_to_line_item,
  parent_company_to_child_company,
} = require("../../3-controllers/hubspotAssociationController");

router.get("/api/get_a_line_item_by_id/:id", get_a_line_item_by_id);
router.post(
  "/api/post_get_a_group_of_line_items_by_id",
  post_get_a_group_of_line_items_by_id
);

//association

router.get("/api/get_company_to_deal/:id", get_company_to_deal);
router.get("/api/get_deal_to_line_item/:id", get_deal_to_line_item);
router.get(
  "/api/parent_company_to_child_company/:id",
  parent_company_to_child_company
);

module.exports = router;
