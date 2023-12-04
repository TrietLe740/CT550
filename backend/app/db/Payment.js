const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    credit: {
      type: Number,
    },
    dateOfPayment: {
      type: Date,
      default: Date.now,
    },
  },
  { collation: { locale: "vi" } }
);

module.exports = mongoose.model("Payments", schema);
