const CarrierAnalytic = require("../4-models/CarrierAnalytic");
const createError = require("http-errors");
const { ticketTypes } = require("../5-utils/constants");
const { json } = require("express");

// exports.get_carrier_analytic = async (req, res, next) => {
//   let filter = req.query.filter || "latest";
//   let currentPage = parseInt(req.query.page) || 1;
//   let itemPerPage = 5;
//   let order = 1;
//   12;
//   try {
//     console.log("api current page", currentPage);
//     let items = await CarrierAnalytic.find()
//       .populate("author", "username")
//       .sort(order === 1 ? "-createdAt" : "createdAt")
//       .skip(itemPerPage * currentPage - itemPerPage)
//       //.skip((currentPage - 1) * itemPerPage)
//       .limit(itemPerPage);

//     let totalItems = await Ticket.countDocuments();
//     let totalPage = totalItems / itemPerPage;

//     return res.send({ items, itemPerPage, currentPage, totalPage, totalItems });
//   } catch (error) {
//     next(error);
//   }
// };

exports.get_carrier_analytic_by_id = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const { client } = req.query;

    console.log("companyId", companyId);
    console.log("client", client);

    // if (!companyId) {
    //   return res
    //     .status(404)
    //     .send({ message: `Data Not found with companyId ${companyId}` });
    // }

    const result = await CarrierAnalytic.findOne({
      companyId: companyId,
      clientApp: client,
    });

    // if (!result) {
    //   return res
    //     .status(404)
    //     .send({ message: "Data Not found with companyId " + companyId });
    // }

    return res.send(result ? result : {});
  } catch (error) {
    next(error);
  }
};

exports.post_carrier_analytic = async (req, res, next) => {
  //validate request

  try {
    const { companyId, clientApp, extensions, description } = req.body;

    const carrierAnalytic = new CarrierAnalytic({
      companyId,
      clientApp,
      extensions: extensions,
      description,
    });

    const result = await carrierAnalytic.save();
    console.log("post_carrier_analytic");
    return res.send(result);
  } catch (error) {
    next(error);
  }
};

exports.delete_carrier_analytic = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const { client } = req.query;
    const result = await CarrierAnalytic.findOneAndDelete({
      companyId,
      clientApp: client,
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
};
