const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
    },
    level: {
      type: Number,
    },
  },
  { collation: { locale: "vi" } }
);

module.exports = mongoose.model("Admins", schema);
