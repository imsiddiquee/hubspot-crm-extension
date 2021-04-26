const { validationResult } = require("express-validator");
const Flash = require("../5-utils/Flash");
const errorFormatter = require("../5-utils/validationErrorFormatter");

exports.get_cart = async (req, res, next) => {
  try {
    //throw new Error("scarey error");

    return res.status(200).json({
      title: "get_cart",
      error: {},
      data: req.session.cart ? req.session.cart : [],
      flashMessage: Flash.getMessage(req),
    });
  } catch (error) {
    next(error);
  }
};

exports.post_cart = async (req, res, next) => {
  let { _id, price } = req.body;
  // let cart = {
  //     items: [
  //         pizzaId: { item: pizzaObject, qty:0 },
  //         pizzaId: { item: pizzaObject, qty:0 },
  //         pizzaId: { item: pizzaObject, qty:0 },
  //     ],
  //     totalQty: 0,
  //     totalPrice: 0
  // }
  // for the first time creating cart and adding basic object structure

  try {
    if (!req.session.cart) {
      req.session.cart = {
        items: {},
        totalQty: 0,
        totalPrice: 0,
      };
    }

    let cart = req.session.cart;

    // Check if item does not exist in cart
    if (!cart.items[_id]) {
      let item = {};
      item = {
        item: req.body,
        qty: 1,
      };

      cart.totalQty = cart.totalQty + 1;
      cart.totalPrice = cart.totalPrice + price;
      cart.items[_id] = item;
    } else {
      let currentCartItem = cart.items[_id];
      currentCartItem.qty = currentCartItem.qty + 1;

      cart.totalQty = cart.totalQty + 1;
      cart.totalPrice = cart.totalPrice + price;
    }

    //console.log("cart", cart);

    req.flash("success", "Created Successfully");
    return res.status(201).json({
      title: "post_cart",
      error: {},
      data: req.session.cart,
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};
