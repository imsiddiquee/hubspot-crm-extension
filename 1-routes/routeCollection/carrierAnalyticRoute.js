const router = require("express").Router();

const {
  get_carrier_analytic_by_id,
  post_carrier_analytic,
  delete_carrier_analytic,
} = require("../../3-controllers/carrierAnalyticController");

//api
router.get("/api/get_carrier_analytic_by_id/:id", get_carrier_analytic_by_id);
router.post("/api/post_carrier_analytic", post_carrier_analytic);
router.delete("/api/delete_carrier_analytic/:id", delete_carrier_analytic);

module.exports = router;
