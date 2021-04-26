const { validationResult } = require("express-validator");
const Flash = require("../5-utils/Flash");

const Order = require("../4-models/Order");
const errorFormatter = require("../5-utils/validationErrorFormatter");

exports.get_order = async (req, res, next) => {
  let term = req.query.term;
  let currentPage = parseInt(req.query.page) || 1;
  let itemPerPage = parseInt(req.query.itemPerPage) || 10;

  try {
    let searchResult = await Order.find()
      .skip(itemPerPage * currentPage - itemPerPage)
      .limit(itemPerPage);

    let totalPost = await Order.countDocuments();
    let totalPage = totalPost / itemPerPage;

    return res.status(200).json({
      title: `Result for - ${term}`,
      error: {},
      flashMessage: Flash.getMessage(req),
      searchTerm: term,
      itemPerPage,
      currentPage,
      totalPage,
      data: searchResult,
    });
  } catch (error) {
    next(error);
  }
};

exports.post_order = async (req, res, next) => {
  let {
    customerId,
    items,
    phone,
    address,
    paymentType,
    paymentStatus,
    status,
  } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  try {
    if (!errors.isEmpty()) {
      req.flash("fail", "Please Check Your Form");
      return res.status(400).json({
        title: "post_order",
        error: errors.mapped(),
        data: {
          customerId,
          items,
          phone,
          address,
          paymentType,
          paymentStatus,
          status,
        },
        flashMessage: Flash.getMessage(req),
      });
    }

    let order = new Order({
      customerId,
      items,
      phone,
      address,
      paymentType,
      paymentStatus,
      status,
    });

    await order.save();

    req.flash("success", "Created Successfully");
    return res.status(201).json({
      title: "post_order",
      error: {},
      data: {
        customerId,
        items,
        phone,
        address,
        paymentType,
        paymentStatus,
        status,
      },
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};

exports.get_admin_order = async (req, res, next) => {
  const result = await Order.find({ status: { $ne: "completed" } }, null, {
    sort: { createdAt: -1 },
  }).populate("customerId", "-password");

  return res.status(200).json({
    title: "get_order",
    error: {},
    data: result,
    flashMessage: Flash.getMessage(req),
  });
};
exports.get_admin_order = async (req, res, next) => {
  let { orderId, status } = req.body;
  Order.updateOne({ _id: orderId }, { status: status }, (err, data) => {
    if (err) {
      //return res.redirect("/admin/orders");
    }
    // Emit event
    // const eventEmitter = req.app.get("eventEmitter");
    // eventEmitter.emit("orderUpdated", {
    //   id: req.body.orderId,
    //   status: req.body.status,
    // });
    // return res.redirect("/admin/orders");
  });

  return res.status(200).json({
    title: "get_order",
    error: {},
    data: result,
    flashMessage: Flash.getMessage(req),
  });
};
