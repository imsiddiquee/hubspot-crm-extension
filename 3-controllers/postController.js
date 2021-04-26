const Post = require("../4-models/Post");

exports.get_blogPost = (req, res, next) => {
  res.status(200).send("get_blogPost");
};

exports.post_blogPost = (req, res, next) => {
  res.status(200).send("post_blogPost");
};
