const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  majors: {
    type: [String],
  },
});

module.exports = mongoose.model("Major", schema);
