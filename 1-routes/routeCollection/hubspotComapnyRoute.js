const router = require("express").Router();

const {
  get_carrier,
  get_tierOne_carrier,
} = require("../../3-controllers/hubspotCompanyController");

router.get("/", get_carrier);
router.get("/getTierOneCarrier", get_tierOne_carrier);

module.exports = router;
