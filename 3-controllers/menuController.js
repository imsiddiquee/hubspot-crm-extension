const { validationResult } = require("express-validator");
const Flash = require("../5-utils/Flash");

const Menu = require("../4-models/Menu");
const errorFormatter = require("../5-utils/validationErrorFormatter");

exports.get_menu = async (req, res, next) => {
  //const temp=await Menu.find();
  return res.status(200).json({
    title: "get_menu",
    error: {},
    data: await Menu.find(),
    flashMessage: Flash.getMessage(req),
  });
};

exports.post_menu = async (req, res, next) => {
  let { name, image, price, size } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  try {
    if (!errors.isEmpty()) {
      req.flash("fail", "Please Check Your Form");
      return res.status(400).json({
        title: "post_menu",
        error: errors.mapped(),
        data: { name, image, price, size },
        flashMessage: Flash.getMessage(req),
      });
    }

    let menu = new Menu({
      name,
      image,
      price,
      size,
    });

    await menu.save();

    req.flash("success", "Created Successfully");
    return res.status(201).json({
      title: "post_menu",
      error: {},
      data: { name, image, price, size },
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};
