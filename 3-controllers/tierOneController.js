const cluster = require("cluster");
const { fork } = require("child_process");
const path = require("path");

const { hubs } = require("../5-utils/constants");
const Hubspot = require("hubspot");

const { get_company } = require("../9-services/tierOneService");

const axios = require("axios");

// async function test(params) {
//   for (let index = 0; index < 3e8; index++) {
//     //
//   }
// }

// exports.get_tierOne = async (req, res, next) => {
//   await test();
//   res.send("OK..." + process.pid);
//   console.log("Success");
//   cluster.worker.kill();
// };

exports.get_tierOne = async (req, res, next) => {
  let companyId = 4949871654;
  let companyName = "test";

  try {
    const processPath = path.join(
      __dirname,
      "..",
      "9-services",
      "tierone_nmc_rmc_calculation_process.js"
    );

    // const child = fork(processPath);
    // child.send({ companyId, companyName });

    // child.on("message", (response) => {
    //   console.log(response);
    //   res.send({ response });
    // });
    //cluster.worker.kill();

    const child = fork(processPath);
    child.send({ companyId, companyName });
    child.on("message", (sum) => {
      console.log("sum:::", sum + "::" + process.pid);
      res.send({ sum: sum + "::" + process.pid });
    });
  } catch (err) {
    next(err);
  }
};

exports.post_tierOne = async (req, res, next) => {
  let companyId = req.body.objectId;
  let companyName = req.body.name;

  try {
    const processPath = path.join(
      __dirname,
      "..",
      "9-services",
      "tierone_nmc_rmc_calculation_process.js"
    );

    const child = fork(processPath);
    child.send({ companyId, companyName });
    child.on("message", (response) => {
      return res
        .status(response.messageType)
        .json({ message: response.message });
    });
    //cluster.workers[process.pid].kill();
  } catch (err) {
    next(err);
  }
};
