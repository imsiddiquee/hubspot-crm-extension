const router = require("express").Router();

const {
  get_deal,
  get_carrier_detail,
} = require("../../3-controllers/hubspotDealController");

router.get("/carrierDetail", get_carrier_detail);
router.get("/:companyId", get_deal);

module.exports = router;
