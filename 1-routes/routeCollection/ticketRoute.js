const router = require("express").Router();

const {
  get_tickets,
  add_ticket,
  update_ticket,
  get_ticket_form,
  get_hubspot_tickets,
  post_ticket,
  post_ticket_form,
  update_ticket_types,

  get_finds,
  create_update_ticket,
  post_add,
  put_update,
  delete_deleteTicket,
  get_ticket_by_id,
} = require("../../3-controllers/ticketController");

const {
  view_tickets,
  view_get_update_ticket,
  view_post_update_ticket,
  view_get_add_ticket,
  view_post_add_ticket,
  view_get_view_ticket,
  view_post_delete_ticket,
} = require("../../9-services/renderTicket");

// //view
// router.get("/", view_tickets);
// router.get("/update_ticket/:id", view_update_ticket);
// router.get("/add_ticket", view_add_ticket);

// //router.get("/", get_tickets);
// router.get("/add_ticket", add_ticket);
// //router.get("/update_ticket", update_ticket);
// router.get("/form", get_ticket_form);
// router.get("/hubspot", get_hubspot_tickets);
// router.post("/", post_ticket);
// router.post("/form", post_ticket_form);
// router.post("/update_ticket_types", update_ticket_types);

// //api
// router.get("/api/tickets", get_find);
// router.post("/api/tickets", post_create);
// router.post("/api/tickets", post_create);
// router.put("/api/tickets/:id", put_update);
// router.delete("/api/tickets/:id", delete_deleteTicket);

// //view
router.get("/", view_tickets);
router.get("/addTicket", view_get_add_ticket);
router.post("/addTicket", view_post_add_ticket);

router.get("/updateTicket/:id", view_get_update_ticket); //607181ce88f0873228e131ac
router.post("/updateTicket", view_post_update_ticket);

router.get("/deleteTicket/:id", view_get_view_ticket); //607181ce88f0873228e131ac
router.post("/deleteTicket", view_post_delete_ticket);

//api
router.get("/api/get_finds", get_finds);
router.get("/api/get_ticket_by_id/:id", get_ticket_by_id);
router.post("/api/post_add", post_add);
router.put("/api/put_update/:id", put_update);

router.delete("/api/delete_deleteTicket/:id", delete_deleteTicket);

module.exports = router;
