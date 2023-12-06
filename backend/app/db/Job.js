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
    maxApplicants: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Số lượng ứng cử viên tối đa phải là số nguyên",
        },
        {
          validator: function (value) {
            return value > 0;
          },
          msg: "Số lượng ứng cử viên tối đa phải lớn hơn 0",
        },
      ],
    },
    maxPositions: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Số lượng vị trí phải là số nguyên",
        },
        {
          validator: function (value) {
            return value > 0;
          },
          msg: "Số lượng vị trí phải lớn hơn 0",
        },
      ],
    },
    activeApplications: {
      type: Number,
      default: 0,
      validate: [
        {
          validator: Number.isInteger,
          msg: "activeApplications should be an integer",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          msg: "activeApplications should greater than equal to 0",
        },
      ],
    },
    acceptedCandidates: {
      type: Number,
      default: 0,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Số lượng ứng viên được nhận phải là số nguyên",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          msg: "Số lượng ứng viên được nhận phải lớn hơn 0",
        },
      ],
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      validate: [
        {
          validator: function (value) {
            return this.dateOfPosting < value;
          },
          msg: "Hạn chót phải lớn hơn ngày đăng",
        },
      ],
    },
    salary: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Mức trợ phí phải là số nguyên",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          msg: "Mức trợ phí không là số âm",
        },
      ],
    },
    jobType: {
      type: String,
    },
    majors: {
      type: [String],
      required: true,
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
    detail: {
      type: String,
    },
    duration: {
      type: "String",
    },
    rating: [Object],
  },
  { collation: { locale: "vi" } }
);

module.exports = mongoose.model("jobs", schema);
