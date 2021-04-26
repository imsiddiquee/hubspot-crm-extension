const { body } = require("express-validator");

module.exports = [
  body("customerId").not().isEmpty().withMessage("Customer Can Not Be Empty"),
  body("items")
    .not()
    .isEmpty()
    .withMessage("Items Can Not Be Empty")
    .isArray()
    .custom((value) => {
      if (
        typeof value === "object" &&
        value &&
        Array.isArray(value) &&
        value.length === 0
      ) {
        throw new Error("Items Can Not Be Empty");
      }
      return true;
    }),
  body("phone").not().isEmpty().withMessage("Phone Can Not Be Empty"),
  body("address").not().isEmpty().withMessage("Address Can Not Be Empty"),
];
