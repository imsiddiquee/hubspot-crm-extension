const router = require("express").Router();

const {
  get_rockets,
  get_rocket_by_id,
} = require("../../3-controllers/rocketController");

router.get("/", get_rockets);
router.get("/:id", get_rocket_by_id);

module.exports = router;
