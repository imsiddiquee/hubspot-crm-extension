const { httpGet, httpPost, httpPut, httpDelete } = require("./httpService");
const currentAPPURI = "http://localhost:8080/tickets";
const {
  formActionTypes,
  pipeline,
  ticketTypes,
} = require("../5-utils/constants");

exports.view_tickets = async (req, res, next) => {
  try {
    let currentPage = parseInt(req.query.page) || 1;
    const uri = `${currentAPPURI}/api/get_finds?page=${currentPage}`;
    const { data } = await httpGet(uri);

    return res.render("tickets", { tickets: data });
  } catch (error) {
    next(error);
  }
};

exports.view_get_add_ticket = async (req, res, next) => {
  console.log("view_get_add_ticket", req.body);
  try {
    const ticket = formatReqBody({
      ticketName: "",
      pipeline, //check box
      checkedPipeline: "warrany,implementation",
      description: "",
      ticketStatus: "New", //radio button
      ticketTypes, //ddl
      ticketType: "SOLVE",
    });

    console.log(ticket);

    return res.render("add_ticket", { ticket });
  } catch (error) {
    next(error);
  }
};

function formatReqBody(body) {
  let formTitle = "Add ticket";
  let actionTypes = formActionTypes.add;
  let formAction = "/tickets/addTicket";
  let formActionMethod = "POST";

  return {
    ...body,
    formTitle,
    formActionTypes: actionTypes,
    formAction,
    formActionMethod,
  };
}

exports.view_post_add_ticket = async (req, res, next) => {
  try {
    const uri = `${currentAPPURI}/api/post_add`;

    const {
      ticketName,
      ticketStatus,
      description,
      checkedPipeline,
      ticketType,
    } = req.body;
    const newOption = {
      ticketName,
      pipeline,
      checkedPipeline: checkedPipeline.toString().trim(),
      ticketPipeline: checkedPipeline.toString().trim(),
      ticketStatus,
      ticketTypes,
      ticketType,
      description: description.trim(),
    };

    console.log(newOption);

    let { data } = await httpPost(uri, newOption);
    if (data) {
      return res.redirect("/tickets");
    } else {
      console.log("newOption", newOption);
      return res.render("add_ticket", { ticket: formatReqBody(newOption) });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.view_get_update_ticket = async (req, res, next) => {
  try {
    const uri = `${currentAPPURI}/api/get_ticket_by_id/${req.params.id}`;
    console.log("uri", uri);

    const { data } = await httpGet(uri);

    const {
      ticketName,
      ticketStatus,
      description,
      ticketPipeline,
      ticketType,
      _id,
    } = data;
    const newOption = {
      ticketName,
      pipeline,
      checkedPipeline: ticketPipeline,
      ticketPipeline: ticketPipeline,
      ticketStatus,
      ticketTypes,
      ticketType,
      description: description.trim(),
      id: _id,
    };

    console.log(newOption);
    return res.render("update_ticket", {
      ticket: formatReqBodyForUpdate(newOption),
    });

    //return res.render("update_ticket", { ticket: data });
    //return res.render("tickets");
  } catch (error) {
    next(error);
  }
};

exports.view_post_update_ticket = async (req, res, next) => {
  try {
    const {
      ticketName,
      ticketStatus,
      description,
      checkedPipeline,
      ticketType,
      ticketId,
    } = req.body;
    const newOption = {
      ticketName,
      pipeline,
      checkedPipeline: checkedPipeline,
      ticketPipeline: checkedPipeline.toString().trim(),
      ticketStatus,
      ticketTypes,
      ticketType,
      description: description.trim(),
      ticketId,
    };

    const uri = `${currentAPPURI}/api/put_update/${ticketId}`;

    let { data } = await httpPut(uri, newOption);
    if (data) {
      return res.redirect("/tickets");
    } else {
      return res.render("update_ticket", {
        ticket: formatReqBodyForUpdate(newOption),
      });
    }
  } catch (error) {
    next(error);
  }
};

function formatReqBodyForUpdate(body) {
  let formTitle = "Update ticket";
  let actionTypes = formActionTypes.update;
  let formAction = "/tickets/updateTicket";
  let formActionMethod = "POST";

  return {
    ...body,
    formTitle,
    formActionTypes: actionTypes,
    formAction,
    formActionMethod,
  };
}

exports.view_get_view_ticket = async (req, res, next) => {
  try {
    const uri = `${currentAPPURI}/api/get_ticket_by_id/${req.params.id}`;
    console.log("uri", uri);

    const { data } = await httpGet(uri);

    const {
      ticketName,
      ticketStatus,
      description,
      ticketPipeline,
      ticketType,
      _id,
    } = data;
    const newOption = {
      ticketName,
      pipeline,
      checkedPipeline: ticketPipeline,
      ticketPipeline: ticketPipeline,
      ticketStatus,
      ticketTypes,
      ticketType,
      description: description.trim(),
      id: _id,
    };

    console.log(newOption);
    return res.render("update_ticket", {
      ticket: formatReqBodyForDelete(newOption),
    });

    //return res.render("update_ticket", { ticket: data });
    //return res.render("tickets");
  } catch (error) {
    next(error);
  }
};

exports.view_post_delete_ticket = async (req, res, next) => {
  try {
    const { ticketId } = req.body;

    const uri = `${currentAPPURI}/api/delete_deleteTicket/${ticketId}`;
    console.log("uri", uri);

    const { data } = await httpDelete(uri);

    console.log("data", data);

    if (data) {
      return res.redirect("/tickets");
    } else {
      return res.render("update_ticket", {
        ticket: formatReqBodyForUpdate(newOption),
      });
    }

    //return res.render("delete_ticket", { ticket: data });
  } catch (error) {
    next(error);
  }
};

function formatReqBodyForDelete(body) {
  let formTitle = "View ticket";
  let actionTypes = formActionTypes.delete;
  let formAction = "/tickets/deleteTicket";
  let formActionMethod = "POST";

  return {
    ...body,
    formTitle,
    formActionTypes: actionTypes,
    formAction,
    formActionMethod,
  };
}
