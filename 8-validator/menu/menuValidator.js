const { body } = require("express-validator");

module.exports = [
  body("name").not().isEmpty().withMessage("Menu Can Not Be Empty"),
  body("image").not().isEmpty().withMessage("Image Can Not Be Empty"),
  body("price").not().isEmpty().withMessage("Price Can Not Be Empty"),
  body("size").not().isEmpty().withMessage("Size Can Not Be Empty"),
];
