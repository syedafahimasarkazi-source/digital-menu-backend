const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "manager", "viewer"],
    default: "manager",
  },
  organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);