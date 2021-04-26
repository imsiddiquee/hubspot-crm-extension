const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
  host: "redis-16259.c16.us-east-1-3.ec2.cloud.redislabs.com",
  port: 16259,
  password: "cUO9vaxvCcXflWPKCv8NTDW5ImDXZHJd",
  //no_ready_check: true,
  //redisKey: "cUO9vaxvCcXflWPKCv8NTDW5ImDXZHJd",
  //return_buffers: true,
});

exports.GET_ASYNC = promisify(client.get).bind(client);
exports.SET_ASYNC = promisify(client.set).bind(client);
exports.DEL_ASYNC = promisify(client.del).bind(client); //redis.del('SampleKey');
exports.SET_UNI_ASYNC = promisify(client.unlink).bind(client);
