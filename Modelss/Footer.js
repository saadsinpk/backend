const mongoose = require("mongoose");

const Footerscema = mongoose.Schema(
  {
    title: { type: String },
    content: {type: String,},
  },
  {
    timestamps: true,
  }
);

const Footer = mongoose.model("Footer", Footerscema);

module.exports = Footer;