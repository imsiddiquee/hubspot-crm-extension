const router = require("express").Router();

const {
  post_blogPost,
  get_blogPost,
} = require("../../3-controllers/postController");

router.get("/", get_blogPost);
router.post("/", post_blogPost);

module.exports = router;
