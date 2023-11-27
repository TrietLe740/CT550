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
      validate: {
        validator: function (v) {
          return v !== ""
            ? /[a-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]/
            : true;
        },
        msg: "Họ và tên không hợp lệ",
      },
    },
    rating: [Object],
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
    notification: [Object],
    following: [Object],
  },
  { collation: { locale: "vi" } }
);

module.exports = mongoose.model("JobApplicants", schema);
