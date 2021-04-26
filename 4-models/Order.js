const { Schema, model } = require("mongoose");

const modelSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: { type: Object, required: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    paymentType: { type: String, default: "COD" },
    paymentStatus: { type: Boolean, default: false },
    status: { type: String, default: "order_placed" },
  },
  { timestamps: true }
);

const Order = model("Order", modelSchema);

module.exports = Order;
