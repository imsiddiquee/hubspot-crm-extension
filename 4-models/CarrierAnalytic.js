const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const { ticketTypes } = require("../5-utils/constants");

const modelSchema = new Schema(
  {
    companyId: {
      type: Number,
      required: true,
      trim: true,
    },
    clientApp: {
      type: String,
      //enum: [ticketTypes.bug],
      required: true,
    },
    // ticketType: {
    //   type: String,
    //   enum: [ticketTypes.bug],
    //   default: ticketTypes.bug,
    // },
    extensions: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CarrierAnalytic = model("CarrierAnalytic", modelSchema);
module.exports = CarrierAnalytic;
