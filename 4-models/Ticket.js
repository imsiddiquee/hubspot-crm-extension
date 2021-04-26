const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const { ticketTypes } = require("../5-utils/constants");

const modelSchema = new Schema(
  {
    ticketName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    ticketType: {
      type: String,
      enum: [ticketTypes.bug],
      default: ticketTypes.bug,
    },
    ticketPipeline: {
      type: String,
      trim: true,
    },
    ticketStatus: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = model("Ticket", modelSchema);
module.exports = Ticket;
