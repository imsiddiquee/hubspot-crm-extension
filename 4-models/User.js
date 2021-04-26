const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const { roles } = require("../5-utils/constants");

const modelSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePics: {
      type: String,
      default: "/uploads/default.png",
    },
    role: {
      type: String,
      enum: [roles.admin, roles.moderator, roles.client],
      default: roles.client,
    },
  },
  {
    timestamps: true,
  }
);

modelSchema.pre("save", async function (next) {
  try {
    console.log("Execute before the save");
    /*
    Here first checking if the document is new by using a helper of mongoose .isNew,
     therefore, this.isNew is true if document is new else false, and we only want to
     hash the password if its a new document, else  it will again hash the password if
      you save the document again by making some changes in other fields incase your document
      contains other fields.
    */
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;

      if (this.email === process.env.ADMIN_EMAIL.toLocaleLowerCase()) {
        this.role = roles.admin;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// modelSchema.post("save", async function (next) {
//   try {
//     console.log("Execute after the save");
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

modelSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createHttpError.InternalServerError(error.message);
  }
};

const User = model("User", modelSchema);
module.exports = User;
