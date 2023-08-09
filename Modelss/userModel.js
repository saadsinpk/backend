const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: Number, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default: "uploads/profiles/profile.png",
    },
    user: { type: String },
    isAdmin: { type: Boolean, default: false },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
});
const User = mongoose.model("userverifies", userSchema);

module.exports = User;
