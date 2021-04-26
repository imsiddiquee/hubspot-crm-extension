const { Schema, model } = require("mongoose");

const modelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    size: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Menu = model("Menu", modelSchema);

module.exports = Menu;
