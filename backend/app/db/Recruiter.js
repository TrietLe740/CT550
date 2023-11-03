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
    companyName: {
      type: String,
      required: true,
    },
    workplace: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      validate: {
        validator: function (v) {
          // return v !== "" ? /((09|03|07|08|05)+([0-9]{8})\b)/.test(v) : true;
          return v !== "" ? /\+\d{1,3}\d{10}/.test(v) : true;
        },
        msg: "Số điện thoại không hợp lệ!",
      },
    },
    bio: {
      type: String,
    },
    level: {
      type: Number,
    },
  },
  { collation: { locale: "vi" } }
);

module.exports = mongoose.model("Recruiters", schema);
