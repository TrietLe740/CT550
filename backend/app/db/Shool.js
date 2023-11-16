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

  logo_url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("School", schema);
