const Ticket = require("../4-models/Ticket");
const createError = require("http-errors");
const { ticketTypes } = require("../5-utils/constants");

//api

exports.get_finds = async (req, res, next) => {
  let filter = req.query.filter || "latest";
  let currentPage = parseInt(req.query.page) || 1;
  let itemPerPage = 5;
  let order = 1;
  12;
  try {
    console.log("api current page", currentPage);
    let items = await Ticket.find()
      .populate("author", "username")
      .sort(order === 1 ? "-createdAt" : "createdAt")
      .skip(itemPerPage * currentPage - itemPerPage)
      //.skip((currentPage - 1) * itemPerPage)
      .limit(itemPerPage);

    let totalItems = await Ticket.countDocuments();
    let totalPage = totalItems / itemPerPage;

    return res.send({ items, itemPerPage, currentPage, totalPage, totalItems });
  } catch (error) {
    next(error);
  }
};

exports.get_ticket_by_id = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(404).send({ message: `Data Not found with id ${id}` });
    }

    const result = await Ticket.findById(id);

    if (!result) {
      return res.status(404).send({ message: "Data Not found with id " + id });
    }

    return res.send(result);
  } catch (error) {
    next(error);
  }
};

exports.post_add = async (req, res, next) => {
  //validate request

  try {
    const { ticketName, ticketPipeline, ticketStatus, description } = req.body;

    const ticket = new Ticket({
      ticketName,
      description,
      ticketPipeline,
      ticketStatus,
    });

    const result = await ticket.save();
    console.log("post_create");
    return res.send(result);
  } catch (error) {
    next(error);
  }
};

exports.put_update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      ticketName,
      description,
      ticketPipeline,
      ticketStatus,
      ticketType,
    } = req.body;
    const options = { new: true };

    console.log("api put_update", id);

    const result = await Ticket.findByIdAndUpdate(
      id,
      { ticketName, description, ticketPipeline, ticketStatus, ticketType },
      options
    );

    console.log({ result });
    res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// exports.create_update_ticket = async (req, res, next) => {
//   const { name, description, id } = req.body;

//   try {
//     if (id) {
//       //edit
//       return this.put_update;
//     }
//     //add
//     return this.post_create;
//   } catch (error) {
//     next(error);
//   }
// };

exports.delete_deleteTicket = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Product.findByIdAndDelete(id);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

// exports.get_ticket_form = async (req, res, next) => {
//   try {
//     let ticket = { ticketType: "", id: "test-ticket-1" };
//     return res
//       .status(200)
//       .render("ticket", { ticket, ticketTypes, flashMessage: {} });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.post_ticket_form = async (req, res, next) => {
//   try {
//     const {
//       ticketId,
//       description,
//       ticketType,
//       stuhobbies,
//       gender,
//       userInput,
//     } = req.body;
//     console.log(
//       `description::${description}, ticketType::${ticketType},stuhobbies:::${
//         stuhobbies || ""
//       }::gender::${gender}::userInput::${userInput}`
//     );

//     let ticket = { ticketType: "SOLVE", id: "test-ticket-2" };

//     return res
//       .status(200)
//       .render("ticket", { ticket, ticketTypes, flashMessage: {} });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.update_ticket_types = async (req, res, next) => {
//   try {
//     const { ticketId, description } = req.body;
//     console.log(`post_ticket_form:::${description}:::${ticketId}`);

//     return res.status(200).render("ticket", { flashMessage: {} });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.post_ticket = async (req, res, next) => {
//   const { name, description } = req.body;
//   console.log("post_ticket");
//   const ticket = new Ticket({
//     description,
//   });

//   try {
//     const result = await ticket.save();
//     console.log("post_ticket");
//     return res.send(result);
//   } catch (error) {
//     next(error);
//   }
// };
