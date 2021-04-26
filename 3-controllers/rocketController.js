const cluster = require("cluster");
const Product = require("../4-models/Product");
const createError = require("http-errors");
const { httpGet } = require("../9-services/httpService");
const { GET_ASYNC, SET_ASYNC } = require("../9-services/redisService");

exports.get_rockets = async (req, res, next) => {
  try {
    const reply = await GET_ASYNC("rockets");
    if (reply) {
      console.log("using cached data");
      return res.send(JSON.parse(reply));
    }

    const { data } = await httpGet("https://api.spacexdata.com/v3/rockets");
    const saveResult = await SET_ASYNC(
      "rockets",
      JSON.stringify(data),
      "EX",
      5
    );
    console.log("new data cached", saveResult);

    cluster.worker.kill();
    return res.send(data);
  } catch (error) {
    next(error);
  }
};

exports.get_rocket_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reply = await GET_ASYNC(id);
    if (reply) {
      console.log("using cached data");
      return res.send(JSON.parse(reply));
    }

    const { data } = await httpGet(
      `https://api.spacexdata.com/v3/rockets/${id}`
    );
    const saveResult = await SET_ASYNC(id, JSON.stringify(data), "EX", 5);
    console.log("new data cached", saveResult);

    return res.send(data);
  } catch (error) {
    next(error);
  }
};
