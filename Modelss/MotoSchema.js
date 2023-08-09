const mongoose = require("mongoose");

const MotoSchema = mongoose.Schema(
  {
    image: { type: String },
    title: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const Moto = mongoose.model("motos", MotoSchema);

module.exports = Moto;
