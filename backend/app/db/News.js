const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      require: true,
    },
    content: {
      type: String,
    },
    majors: {
      type: [String],
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
  },
  { collation: { locale: "vi" } }
);

module.exports = mongoose.model("News", schema);
