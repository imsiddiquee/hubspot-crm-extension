const axios = require("axios");

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("unexptedted error::", expectedError);
  }
  return Promise.reject(error);
});

exports.httpGet = axios.get;
exports.httpPost = axios.post;
exports.httpPut = axios.put;
exports.httpDelete = axios.delete;
