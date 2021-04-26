const User = require("../4-models/User");
const mongoose = require("mongoose");
const { roles } = require("../5-utils/constants");
const Flash = require("../5-utils/Flash");

exports.get_all_user = async (req, res, next) => {
  const users = await User.find();
  return res.render("manage-users", { users, flashMessage: {} });
};

exports.get_user_by_id = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Id");
    return res.redirect("/admin/users");
  }
  const person = await User.findById(id);
  return res.status(200).render("profile", { person });
};

exports.get_user = (req, res, next) => {
  return res
    .status(200)
    .render("profile", { flashMessage: {}, person: req.user });
};

exports.post_user = (req, res, next) => {
  res.status(200).send("post_user");
};

exports.update_role = async (req, res, next) => {
  try {
    const { id, role } = req.body;

    // Checking for id and roles in req.body
    if (!id || !role) {
      req.flash("error", "Please Check Your Form");
      return res.redirect("back", { flashMessage: Flash.getMessage(req) });
    }

    // Check for valid mongoose objectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid id");
      return res.redirect("back", { flashMessage: Flash.getMessage(req) });
    }

    // Check for Valid role
    const rolesArray = Object.values(roles);
    if (!rolesArray.includes(role)) {
      req.flash("error", "Invalid role");
      return res.redirect("back", { flashMessage: Flash.getMessage(req) });
    }

    // Admin cannot remove himself/herself as an admin
    if (req.user.id === id) {
      req.flash(
        "info",
        "Admins cannot remove themselves from Admin, ask another admin."
      );
      return res.redirect("back", { flashMessage: Flash.getMessage(req) });
    }

    // Finally update the user
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    req.flash("success", `updated role for ${user.email} to ${user.role}`);
    res.redirect("back", { flashMessage: Flash.getMessage(req) });
  } catch (error) {
    next(error);
  }
};
