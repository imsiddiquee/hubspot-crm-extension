const postRoute = require("./routeCollection/postRoute");
const authRoute = require("./routeCollection/authRoute");
const menuRoute = require("./routeCollection/menuRoute");
const orderRoute = require("./routeCollection/orderRoute");
const cartRoute = require("./routeCollection/cartRoute");
const tierOneRoute = require("./routeCollection/tierOneRoute");
const userRoute = require("./routeCollection/userRoute");
const productRoute = require("./routeCollection/productRoute");
const rocketRoute = require("./routeCollection/rocketRoute");
const ticketRoute = require("./routeCollection/ticketRoute");
const hubspotComapnyRoute = require("./routeCollection/hubspotComapnyRoute");
const hubspotDealRoute = require("./routeCollection/hubspotDealRoute");
const hubspoRoute = require("./routeCollection/hubspoRoute");
const carrierAnalyticRoute = require("./routeCollection/carrierAnalyticRoute");

const routes = [
  {
    path: "/blogpost",
    handler: postRoute,
  },
  {
    path: "/auth",
    handler: authRoute,
  },
  {
    path: "/order",
    handler: orderRoute,
  },
  {
    path: "/cart",
    handler: cartRoute,
  },
  {
    path: "/tierone",
    handler: tierOneRoute,
  },
  {
    path: "/user",
    handler: userRoute,
  },
  {
    path: "/admin",
    handler: userRoute,
  },
  {
    path: "/products",
    handler: productRoute,
  },
  {
    path: "/rockets",
    handler: rocketRoute,
  },
  {
    path: "/tickets",
    handler: ticketRoute,
  },
  {
    path: "/hubCompany",
    handler: hubspotComapnyRoute,
  },
  {
    path: "/hubDeal",
    handler: hubspotDealRoute,
  },
  {
    path: "/hubspot",
    handler: hubspoRoute,
  },
  {
    path: "/carrierAnalytic",
    handler: carrierAnalyticRoute,
  },
  {
    path: "/",
    handler: (req, res) => {
      return res.status(200).render("home");
    },
  },
];

module.exports = (app) => {
  routes.forEach((r) => {
    if (r.path === "/") {
      app.get(r.path, r.handler);
    } else {
      app.use(r.path, r.handler);
    }
  });
};
