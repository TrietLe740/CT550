const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      // required: true,
    },
    role: {
      type: String,
      // required: true,
    },
    companyName: {
      type: String,
      // required: true,
    },
    companyMail: {
      type: String,
    },
    website: {
      type: String,
    },
    bio: {
      type: String,
    },
    contactNumber: {
      type: String,
      // validate: {
      //   validator: function (v) {
      //     // return v !== "" ? /((09|03|07|08|05)+([0-9]{8})\b)/.test(v) : true;
      //     return v !== "" ? /\+\d{1,3}\d{10}/.test(v) : true;
      //   },
      //   msg: "Số điện thoại không hợp lệ!",
      // },
    },
    location: {
      no: {
        type: String,
      },
      province: {
        type: String,
      },
      district: {
        type: String,
      },
      commune: {
        type: String,
      },
    },
    avatar: {
      type: Object,
    },
    level: {
      type: Number,
    },
  },
  { collation: { locale: "vi" } }
);

module.exports = mongoose.model("Recruiters", schema);
