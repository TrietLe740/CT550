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
    role: {
      type: String,
    },
    companyName: {
      type: String,
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
    notification: [Object],
    follower: [Object],
    credit: {
      type: Number,
    },
    paymentCard: {
      name: {
        type: String,
      },
      cardNumber: {
        type: String,
      },
      cvv: {
        type: String,
      },
      month: {
        type: String,
      },
      year: {
        type: String,
      },
    },
  },
  { collation: { locale: "vi" } }
);

module.exports = mongoose.model("Recruiters", schema);
