const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },

  codename: {
    type: String,
    required: true,
  },

  division_type: {
    type: String,
    required: true,
  },

  phone_code: {
    type: Number,
    required: true,
  },
  districts: {
    type: [Object],
  },
});

module.exports = mongoose.model("Location", schema);
