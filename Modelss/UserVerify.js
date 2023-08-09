const mongoose = require("mongoose");

const UserVerifySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  pic: {
    type: String,
  },
  user: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

UserVerifySchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
});

const UserVerify = mongoose.model("userVerifies", UserVerifySchema);

module.exports = UserVerify;
