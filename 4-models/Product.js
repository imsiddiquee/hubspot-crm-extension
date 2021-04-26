const { Schema, model } = require("mongoose");

const modelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
  },
  { timestamps: true }
);

const Product = model("Product", modelSchema);

module.exports = Product;
