const { Schema, model } = require("mongoose");

const modelSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      maxlength: 5000,
    },
  },
  { timestamps: true }
);

const Post = model("Post", modelSchema);

module.exports = Post;
