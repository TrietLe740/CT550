const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      max: 5.0,
      default: -1.0,
      validate: {
        validator: function (v) {
          return v >= -1.0 && v <= 5.0;
        },
        msg: "Invalid rating",
      },
    },
    avatar: {
      type: String,
    },
    major: {
      type: String,
    },
    contactNumber: {
      type: String,
      validate: {
        validator: function (v) {
          // return v !== "" ? /((09|03|07|08|05)+([0-9]{8})\b)/g.test(v) : true;
          return v !== "" ? /\+\d{1,3}\d{10}/.test(v) : true;
        },
        msg: "Số điện thoại không hợp lệ!",
      },
    },
    socialLink: [
      {
        link: {
          type: String,
          required: true,
        },
      },
    ],
    skills: [String],
    activities: [String],
    certificates: [String],
    awards: [String],
    target: String,
    exp: String,
    interest: String,
    resume: [Object],
    level: {
      type: Number,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("JobApplicants", schema);
