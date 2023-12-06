const express = require("express");
const mongoose = require("mongoose");
const jwtAuth = require("../lib/jwtAuth");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Job = require("../db/Job");
const Application = require("../db/Application");
const Major = require("../db/Major");
const School = require("../db/Shool");
const Location = require("../db/Location");
const Rating = require("../db/Rating");
const News = require("../db/News");
const Payment = require("../db/Payment");

const router = express.Router();

// Công việc
router.post("/jobs", jwtAuth, (req, res) => {
  const user = req.user;

  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền thêm công việc!",
    });
    return;
  }

  const data = req.body;

  let job = new Job({
    userId: user._id,
    title: data.title,
    maxApplicants: data.maxApplicants,
    maxPositions: data.maxPositions,
    dateOfPosting: data.dateOfPosting,
    deadline: data.deadline,
    skillsets: data.skillsets,
    jobType: data.jobType,
    salary: data.salary,
    location: data.location,
    majors: data.major,
    detail: data.detail,
    duration: data.duration,
  });

  console.log(data);
  job
    .save()
    .then(() => {
      res.json({ message: "Công việc đã được thêm thành công!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/jobs", jwtAuth, (req, res) => {
  let user = req.user;
  console.log(req.user);
  let major = req.user.major;
  console.log(req.user.major);

  let findParams = {};
  let sortParams = {};

  if (user.type === "recruiter" && req.query.myjobs) {
    findParams = {
      ...findParams,
      userId: user._id,
    };
  }

  if (req.query.q) {
    findParams = {
      ...findParams,
      title: {
        $regex: new RegExp(req.query.q),
        $options: "i",
      },
    };
  }

  if (req.query.jobType) {
    let jobTypes = [];
    if (Array.isArray(req.query.jobType)) {
      jobTypes = req.query.jobType;
    } else {
      jobTypes = [req.query.jobType];
    }
    console.log(jobTypes);
    findParams = {
      ...findParams,
      jobType: {
        $in: jobTypes,
      },
    };
  }

  if (req.query.salaryMin && req.query.salaryMax) {
    findParams = {
      ...findParams,
      $and: [
        {
          salary: {
            $gte: parseInt(req.query.salaryMin),
          },
        },
        {
          salary: {
            $lte: parseInt(req.query.salaryMax),
          },
        },
      ],
    };
  } else if (req.query.salaryMin) {
    findParams = {
      ...findParams,
      salary: {
        $gte: parseInt(req.query.salaryMin),
      },
    };
  } else if (req.query.salaryMax) {
    findParams = {
      ...findParams,
      salary: {
        $lte: parseInt(req.query.salaryMax),
      },
    };
  }

  if (req.query.duration) {
    findParams = {
      ...findParams,
      duration: {
        $lt: parseInt(req.query.duration),
      },
    };
  }

  if (req.query.asc) {
    if (Array.isArray(req.query.asc)) {
      req.query.asc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: 1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.asc]: 1,
      };
    }
  }

  if (req.query.desc) {
    if (Array.isArray(req.query.desc)) {
      req.query.desc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: -1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.desc]: -1,
      };
    }
  }

  let arr = [
    {
      $lookup: {
        from: "recruiters",
        localField: "userId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    { $match: findParams },
  ];

  if (Object.keys(sortParams).length > 0) {
    arr = [
      {
        $lookup: {
          from: "recruiters",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
      {
        $sort: sortParams,
      },
    ];
  }

  Job.aggregate(arr)
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "No job found",
        });
        return;
      }
      const sortMajor = posts.sort((value) => {
        return value?.majors?.includes(major) ? -1 : 1;
      });

      res.json(
        // Sap xep nganh lien quan len dau
        sortMajor
      );
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/jobs/:id", jwtAuth, (req, res) => {
  Job.findOne({ _id: req.params.id })
    .then((job) => {
      if (job == null) {
        res.status(400).json({
          message: "Công việc không tồn tại!",
        });
        return;
      }
      res.json(job);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.put("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền thay đổi chi tiết công việc!",
    });
    return;
  }
  Job.findOne({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job == null) {
        res.status(404).json({
          message: "Công việc không tồn tại!",
        });
        return;
      }
      const data = req.body;
      if (data.maxApplicants) {
        job.maxApplicants = data.maxApplicants;
      }
      if (data.maxPositions) {
        job.maxPositions = data.maxPositions;
      }
      if (data.deadline) {
        job.deadline = data.deadline;
      }
      job
        .save()
        .then(() => {
          res.json({
            message: "Công việc đã được cập nhật thành công!",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không được quyền xóa công việc!",
    });
    return;
  }
  Job.findOneAndDelete({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job === null) {
        res.status(401).json({
          message: "Bạn không có quyền xóa công việc!",
        });
        return;
      }
      res.json({
        message: "Công việc đã được xóa thành công!",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// Người dùng
router.get("/user", jwtAuth, (req, res) => {
  const users = User.find().then((users) => {
    res.json(users);
  });
});

router.get("/user/recruiter", jwtAuth, (req, res) => {
  const recruiters = Recruiter.find().then((recruiters) => {
    res.json(recruiters);
  });
});

router.get("/user/intern", jwtAuth, (req, res) => {
  const interns = JobApplicant.find().then((interns) => {
    res.json(interns);
  });
});

router.get("/user/recruiter/:id", jwtAuth, (req, res) => {
  Recruiter.findOne({ _id: req.params.id })
    .then((recruiter) => {
      if (recruiter === null) {
        res.status(404).json({
          message: "Người dùng không tồn tại!!",
        });
        return;
      }
      res.json(recruiter);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/user/intern/:id", jwtAuth, (req, res) => {
  JobApplicant.findOne({ _id: req.params.id })
    .then((intern) => {
      if (intern === null) {
        res.status(404).json({
          message: "Người dùng không tồn tại!!",
        });
        return;
      }
      res.json(intern);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/user/:id", jwtAuth, async (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      console.log("ID: " + req.params.id);
      console.log(userData);
      if (userData === null) {
        res.status(404).json({
          message: "Người dùng không tồn tại!",
        });
        return;
      }

      if (userData.type === "recruiter") {
        Recruiter.findOne({ userId: userData._id })
          .then((recruiter) => {
            if (recruiter === null) {
              res.status(404).json({
                message: "Người dùng không tồn tại!!",
              });
              return;
            }
            res.json(recruiter);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        JobApplicant.findOne({ userId: userData._id })
          .then((jobApplicant) => {
            if (jobApplicant === null) {
              res.status(404).json({
                message: "Người dùng không tồn tại!!!",
              });
              return;
            }
            res.json(jobApplicant);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  // try {
  //   const user = await User.findOne({ _id: req.params.id });
  //   console.log(req.params.id);
  //   console.log(user);
  //   if (user.type === "recruiter") {
  //     const recruiter = Recruiter.findOne({ userId: user._id });
  //     console.log(recruiter);
  //     if (recruiter === null) {
  //       res.status(404).json({
  //         message: "Người dùng không tồn tại!!",
  //       });
  //     } else {
  //       res.json(recruiter);
  //     }
  //   } else {
  //     const jobapplicant = JobApplicant.findOne({ userId: user._id });
  //   }
  // } catch (err) {
  //   res.status(400).json(err);
  // }
});

router.put("/user", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  console.log(user);
  console.log(data);
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại!",
          });
          return;
        }
        if (data.name) {
          recruiter.name = data.name;
        }
        if (data.role) {
          recruiter.role = data.role;
        }
        if (data.companyName) {
          recruiter.companyName = data.companyName;
        }
        if (data.companyMail) {
          recruiter.companyMail = data.companyMail;
        }
        if (data.website) {
          recruiter.website = data.website;
        }
        if (data.bio) {
          recruiter.bio = data.bio;
        }
        if (data.contactNumber) {
          recruiter.contactNumber = data.contactNumber;
        }
        if (data.location) {
          recruiter.location = data.location;
        }
        if (data.avatar) {
          recruiter.avatar = data.avatar;
        }
        if (data.notification) {
          recruiter.notification = data.notification;
        }
        if (data.follower) {
          recruiter.follower = data.follower;
        }
        if (data.credit) {
          recruiter.credit = data.credit;
        }
        if (data.paymentCard) {
          recruiter.paymentCard = data.paymentCard;
        }
        if (
          recruiter?.name !== "" &&
          recruiter?.contactNumber !== "" &&
          recruiter?.companyName &&
          recruiter?.companyMail !== "" &&
          recruiter?.bio !== "" &&
          recruiter?.location !== "" &&
          recruiter?.level < 1
        ) {
          recruiter.level = 1;
        }
        recruiter
          .save()
          .then(() => {
            res.json({
              message: "Thông tin người dùng được cập nhật thành công!",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại!",
          });
          return;
        }
        if (data.name) {
          jobApplicant.name = data.name;
        }
        if (data.rating) {
          jobApplicant.rating = data.rating;
        }
        if (data.avatar) {
          jobApplicant.avatar = data.avatar;
        }
        if (data.major) {
          jobApplicant.major = data.major;
        }
        if (data.school) {
          jobApplicant.school = data.school;
        }
        if (data.contactNumber) {
          jobApplicant.contactNumber = data.contactNumber;
        }
        // if (data.socialLink) {
        //   jobApplicant.socialLink = data.socialLink;
        // }
        // if (data.skills) {
        //   jobApplicant.skills = data.skills;
        // }
        // if (data.activities) {
        //   jobApplicant.activities = data.activities;
        // }
        // if (data.certificates) {
        //   jobApplicant.certificates = data.certificates;
        // }
        // if (data.awards) {
        //   jobApplicant.awards = data.awards;
        // }
        // if (data.targer) {
        //   jobApplicant.targer = data.targer;
        // }
        // if (data.exp) {
        //   jobApplicant.exp = data.exp;
        // }
        // if (data.interest) {
        //   jobApplicant.interest = data.interest;
        // }
        if (data.resume) {
          jobApplicant.resume = data.resume;
        }
        if (data.notification) {
          jobApplicant.notification = data.notification;
        }
        if (data.rating) {
          jobApplicant.rating = data.rating;
        }
        if (data.following) {
          jobApplicant.follower = data.following;
        }
        if (data.credit) {
          jobApplicant.credit = data.credit;
        }
        if (data.paymentCard) {
          jobApplicant.paymentCard = data.paymentCard;
        }
        if (
          jobApplicant?.name !== "" &&
          jobApplicant?.contactNumber !== "" &&
          jobApplicant?.school &&
          jobApplicant?.major !== "" &&
          jobApplicant?.level < 1
        ) {
          jobApplicant.level = 1;
        }
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            res.json({
              message: "Thông tin người dùng được cập nhật thành công!",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

router.put("/user/updateLV", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại!",
          });
          return;
        }
        if (data.credit) {
          recruiter.credit = parseInt(data.credit) - parseInt(recruiter.credit);
        }
        if (data.credit == 100) {
          recruiter.level = 2;
        }
        if (data.paymentCard) {
          recruiter.paymentCard = data.paymentCard;
        }
        if (recruiter.credit >= data.credit) {
          if (data.credit) {
            recruiter.credit =
              parseInt(data.credit) - parseInt(recruiter.credit);
          }
          if (data.credit == 100) {
            recruiter.level = 2;
          }
          if (data.paymentCard) {
            recruiter.paymentCard = data.paymentCard;
          }
          recruiter
            .save()
            .then(() => {
              let payment = new Payment({
                userId: recruiter.userId,
                paymentCard: recruiter.paymentCard,
                credit: data.credit,
              });

              payment
                .save()
                .then(() => {
                  res.json({
                    message: `Bạn đã nâng cấp thành công!`,
                  });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          res.json({
            message: `Tài khoản bạn không đủ xu`,
          });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại!",
          });
          return;
        }
        if (jobApplicant.credit >= data.credit) {
          if (data.credit) {
            jobApplicant.credit =
              parseInt(data.credit) - parseInt(jobApplicant.credit);
          }
          if (data.credit == 100) {
            jobApplicant.level = 2;
          }
          if (data.paymentCard) {
            jobApplicant.paymentCard = data.paymentCard;
          }
          jobApplicant
            .save()
            .then(() => {
              let payment = new Payment({
                userId: jobApplicant.userId,
                paymentCard: jobApplicant.paymentCard,
                credit: data.credit,
              });

              payment
                .save()
                .then(() => {
                  res.json({
                    message: `Bạn đã nâng cấp thành công!`,
                  });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          res.json({
            message: `Tài khoản bạn không đủ xu`,
          });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

router.put("/user/recruiter", jwtAuth, (req, res) => {
  const data = req.body;
  console.log("USER_ID: " + data._id);

  // User.findOne({ _id: user.userId }).then((user) => {
  //   if (user == null) {
  //     res.status(404).json({
  //       message: "Người dùng không tồn tại!",
  //     });
  //     return;
  //   }
  //   if (data.email) {
  //     user.email = data.email;
  //   }
  //   user
  //     .save()
  //     .then(() => {
  //       res.json({
  //         message: "Thông tin người dùng được cập nhật thành công!",
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(400).json(err);
  //     });
  // });

  Recruiter.findOne({ _id: data._id })
    .then((recruiter) => {
      if (recruiter == null) {
        res.status(404).json({
          message: "Người dùng không tồn tại!",
        });
        return;
      }
      if (data.name) {
        recruiter.name = data.name;
      }
      if (data.role) {
        recruiter.role = data.role;
      }
      if (data.companyName) {
        recruiter.companyName = data.companyName;
      }
      if (data.companyMail) {
        recruiter.companyMail = data.companyMail;
      }
      if (data.website) {
        recruiter.website = data.website;
      }
      if (data.bio) {
        recruiter.bio = data.bio;
      }
      if (data.contactNumber) {
        recruiter.contactNumber = data.contactNumber;
      }
      if (data.location) {
        recruiter.location = data.location;
      }
      if (data.avatar) {
        recruiter.avatar = data.avatar;
      }
      if (data.notification) {
        recruiter.notification = data.notification;
      }
      if (data.follower) {
        recruiter.follower = data.follower;
      }
      if (data.credit) {
        recruiter.credit = data.credit;
      }
      if (data.paymentCard) {
        recruiter.paymentCard = data.paymentCard;
      }
      if (
        recruiter?.name !== "" &&
        recruiter?.contactNumber !== "" &&
        recruiter?.companyName &&
        recruiter?.companyMail !== "" &&
        recruiter?.bio !== "" &&
        recruiter?.location !== "" &&
        recruiter?.level < 1
      ) {
        recruiter.level = 1;
      }
      recruiter
        .save()
        .then(() => {
          res.json({
            message: "Thông tin người dùng được cập nhật thành công!",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.put("/user/intern", jwtAuth, (req, res) => {
  const data = req.body;
  console.log("ID: " + data._id);
  JobApplicant.findOne({ _id: data._id })
    .then((jobApplicant) => {
      if (jobApplicant == null) {
        res.status(404).json({
          message: "Người dùng không tồn tại!",
        });
        return;
      }
      if (data.name) {
        jobApplicant.name = data.name;
      }
      if (data.rating) {
        jobApplicant.rating = data.rating;
      }
      if (data.avatar) {
        jobApplicant.avatar = data.avatar;
      }
      if (data.major) {
        jobApplicant.major = data.major;
      }
      if (data.school) {
        jobApplicant.school = data.school;
      }
      if (data.contactNumber) {
        jobApplicant.contactNumber = data.contactNumber;
      }
      // if (data.socialLink) {
      //   jobApplicant.socialLink = data.socialLink;
      // }
      // if (data.skills) {
      //   jobApplicant.skills = data.skills;
      // }
      // if (data.activities) {
      //   jobApplicant.activities = data.activities;
      // }
      // if (data.certificates) {
      //   jobApplicant.certificates = data.certificates;
      // }
      // if (data.awards) {
      //   jobApplicant.awards = data.awards;
      // }
      // if (data.targer) {
      //   jobApplicant.targer = data.targer;
      // }
      // if (data.exp) {
      //   jobApplicant.exp = data.exp;
      // }
      // if (data.interest) {
      //   jobApplicant.interest = data.interest;
      // }
      if (data.resume) {
        jobApplicant.resume = data.resume;
      }
      if (data.notification) {
        jobApplicant.notification = data.notification;
      }
      if (data.rating) {
        jobApplicant.rating = data.rating;
      }
      if (data.following) {
        jobApplicant.follower = data.following;
      }
      if (data.credit) {
        jobApplicant.credit = data.credit;
      }
      if (data.paymentCard) {
        jobApplicant.paymentCard = data.paymentCard;
      }
      if (
        jobApplicant?.name !== "" &&
        jobApplicant?.contactNumber !== "" &&
        jobApplicant?.school &&
        jobApplicant?.major !== "" &&
        jobApplicant?.level < 1
      ) {
        jobApplicant.level = 1;
      }
      console.log(jobApplicant);
      jobApplicant
        .save()
        .then(() => {
          res.json({
            message: "Thông tin người dùng được cập nhật thành công!",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/user/:id", jwtAuth, async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ _id: data.notification.AID });
    console.log(data.notification.UID);
    console.log(user);
    if (user.type == "recruiter") {
      const company = await Recruiter.findOne({
        _id: data.notification.UID,
      });
      console.log(company);
      company.notification.push(data);
      await company.save();
      res.status(200).json({
        message: "Thông báo đã được đẩy lên",
      });
    }
    if (user.type == "applicant") {
      const applicant = await JobApplicant.findOne({
        _id: data.notification.UID,
      });
      console.log(applicant);
      applicant.notification.push(data);
      await applicant.save();
      res.status(200).json({
        message: "Thông báo đã được đẩy lên",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Có lỗi xảy ra",
    });
  }
});

// Ứng tuyển
router.post("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "applicant") {
    res.status(401).json({
      message: "Bạn không có quyền ứng tuyển công việc này!",
    });
    return;
  }
  const data = req.body;
  const jobId = req.params.id;

  Application.findOne({
    userId: user._id,
    jobId: jobId,
    status: {
      $nin: ["deleted", "accepted", "cancelled"],
    },
  })
    .then((appliedApplication) => {
      if (appliedApplication !== null) {
        res.status(400).json({
          message: "Bạn đã nộp đơn cho công việc này!",
        });
        return;
      }

      Job.findOne({ _id: jobId })
        .then((job) => {
          if (job === null) {
            res.status(404).json({
              message: "Công việc không tồn tại!",
            });
            return;
          }
          Application.countDocuments({
            jobId: jobId,
            status: {
              $nin: ["rejected", "deleted", "cancelled", "finished"],
            },
          })
            .then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxApplicants) {
                Application.countDocuments({
                  userId: user._id,
                  status: {
                    $nin: ["rejected", "deleted", "cancelled", "finished"],
                  },
                })
                  .then((myActiveApplicationCount) => {
                    if (myActiveApplicationCount < 10) {
                      Application.countDocuments({
                        userId: user._id,
                        status: "accepted",
                      }).then((acceptedJobs) => {
                        if (acceptedJobs === 0) {
                          JobApplicant.findOne({
                            userId: user._id,
                          }).then((v) => {
                            const application = new Application({
                              userId: user._id,
                              recruiterId: job.userId,
                              jobId: job._id,
                              status: "applied",
                              sop: data.sop,
                              resume: data.resume,
                            });
                            application
                              .save()
                              .then(() => {
                                res.json({
                                  message: "Đơn xin việc thành công!",
                                });
                              })
                              .catch((err) => {
                                res.status(400).json(err);
                              });
                          });
                        } else {
                          res.status(400).json({
                            message:
                              "Bạn đã được xác nhận tham gia công việc. Do đó bạn không thể ứng tuyển công việc khác",
                          });
                        }
                      });
                    } else {
                      res.status(400).json({
                        message:
                          "Bạn đã nộp 10 đơn ứng tuyển. Do đó bạn sẽ không thể nộp đơn thêm!",
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "Số lượng ứng cử viên đạt giới hạn!",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.json(400).json(err);
    });
});

router.get("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền xem đơn ứng tuyển!",
    });
    return;
  }
  const jobId = req.params.id;

  let findParams = {
    jobId: jobId,
    recruiterId: user._id,
  };

  let sortParams = {};

  if (req.query.status) {
    findParams = {
      ...findParams,
      status: req.query.status,
    };
  }

  Application.find(findParams)
    .collation({ locale: "en" })
    .sort(sortParams)
    // .skip(skip)
    // .limit(limit)
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/applications", jwtAuth, (req, res) => {
  const user = req.user;

  Application.aggregate([
    {
      $lookup: {
        from: "jobapplicants",
        localField: "userId",
        foreignField: "userId",
        as: "jobApplicant",
      },
    },
    { $unwind: "$jobApplicant" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $lookup: {
        from: "recruiters",
        localField: "recruiterId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    {
      $match: {
        [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,
      },
    },
    {
      $sort: {
        dateOfApplication: -1,
      },
    },
  ])
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/applications/all", jwtAuth, (req, res) => {
  const applications = Application.find().then((applications) => {
    res.json(applications);
  });
});

router.put("/applications/:id", jwtAuth, (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const status = req.body.status;

  if (user.type === "recruiter") {
    if (status === "accepted") {
      Application.findOne({
        _id: id,
        recruiterId: user._id,
      })
        .then((application) => {
          if (application === null) {
            res.status(404).json({
              message: "Không tìm thấy ứng viên!",
            });
            return;
          }

          Job.findOne({
            _id: application.jobId,
            userId: user._id,
          }).then((job) => {
            if (job === null) {
              res.status(404).json({
                message: "Công việc không tồn tại!",
              });
              return;
            }

            Application.countDocuments({
              recruiterId: user._id,
              jobId: job._id,
              status: "accepted",
            }).then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxPositions) {
                // accepted
                application.status = status;
                application.dateOfJoining = req.body.dateOfJoining;
                application
                  .save()
                  .then(() => {
                    Application.updateMany(
                      {
                        _id: {
                          $ne: application._id,
                        },
                        userId: application.userId,
                        status: {
                          $nin: [
                            "rejected",
                            "deleted",
                            "cancelled",
                            "accepted",
                            "finished",
                          ],
                        },
                      },
                      {
                        $set: {
                          status: "cancelled",
                        },
                      },
                      { multi: true }
                    )
                      .then(() => {
                        if (status === "accepted") {
                          Job.findOneAndUpdate(
                            {
                              _id: job._id,
                              userId: user._id,
                            },
                            {
                              $set: {
                                acceptedCandidates: activeApplicationCount + 1,
                              },
                            }
                          )
                            .then(() => {
                              res.json({
                                message: `Application ${status} thành công!`,
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.json({
                            message: `Application ${status} thành công!`,
                          });
                        }
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "Công việc này đã đủ ứng cử viên!",
                });
              }
            });
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      Application.findOneAndUpdate(
        {
          _id: id,
          recruiterId: user._id,
          status: {
            $nin: ["rejected", "deleted", "cancelled"],
          },
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((application) => {
          if (application === null) {
            res.status(400).json({
              message: "Không thể cập nhật trạng thái!",
            });
            return;
          }
          if (status === "finished") {
            res.json({
              message: `Công việc ${status} thành công!`,
            });
          } else {
            res.json({
              message: `Ứng tuyển ${status} thành công!`,
            });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  } else {
    if (status === "cancelled") {
      console.log(id);
      console.log(user._id);
      Application.findOneAndUpdate(
        {
          _id: id,
          userId: user._id,
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((tmp) => {
          console.log(tmp);
          res.json({
            message: `Ứng tuyển ${status} thành công!`,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(401).json({
        message: "Bạn không có quyền cập nhật trạng thái công việc!",
      });
    }
  }
});

// Người ứng tuyển
router.get("/applicants", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    let findParams = {
      recruiterId: user._id,
    };
    if (req.query.jobId) {
      findParams = {
        ...findParams,
        jobId: new mongoose.Types.ObjectId(req.query.jobId),
      };
    }
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        findParams = {
          ...findParams,
          status: { $in: req.query.status },
        };
      } else {
        findParams = {
          ...findParams,
          status: req.query.status,
        };
      }
    }
    let sortParams = {};

    if (!req.query.asc && !req.query.desc) {
      sortParams = { _id: 1 };
    }

    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }

    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }

    Application.aggregate([
      {
        $lookup: {
          from: "jobapplicants",
          localField: "userId",
          foreignField: "userId",
          as: "jobApplicant",
        },
      },
      { $unwind: "$jobApplicant" },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: findParams },
      { $sort: sortParams },
    ])
      .then((applications) => {
        if (applications.length === 0) {
          res.status(404).json({
            message: "Không tìm thấy ứng viên nào!",
          });
          return;
        }
        res.json(applications);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      message: "Bạn không được phép truy cập danh sách ứng viên!",
    });
  }
});

router.get("/majors", jwtAuth, (req, res) => {
  const majors = Major.find().then((majors) => {
    res.json(majors);
  });
});

router.get("/schools", jwtAuth, (req, res) => {
  const schools = School.find().then((schools) => {
    res.json(schools);
  });
});

router.get("/locations", jwtAuth, (req, res) => {
  const locations = Location.find().then((locations) => {
    res.json(locations);
  });
});

router.put("/rating", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type === "recruiter") {
    // can rate applicant
    Rating.findOne({
      senderId: user._id,
      receiverId: data.applicantId,
      category: "applicant",
    })
      .then((rating) => {
        if (rating === null) {
          console.log("new rating");
          Application.countDocuments({
            userId: data.applicantId,
            recruiterId: user._id,
            status: {
              $in: ["accepted", "finished"],
            },
          })
            .then((acceptedApplicant) => {
              if (acceptedApplicant > 0) {
                console.log(data.rating);
                rating = new Rating({
                  category: "applicant",
                  receiverId: data.applicantId,
                  senderId: user._id,
                  rating: data.rating,
                });
                console.log("AA");
                console.log(rating);
                rating
                  .save()
                  .then(() => {
                    Rating.aggregate([
                      {
                        $match: {
                          receiverId: mongoose.Types.ObjectId(data.applicantId),
                          category: "applicant",
                        },
                      },
                      {
                        $group: {
                          _id: {},
                          average: { $avg: "$rating" },
                        },
                      },
                    ])
                      .then((result) => {
                        console.log(result);
                        if (result === null) {
                          res.status(400).json({
                            message: "Lỗi đánh giá",
                          });
                          return;
                        }
                        console.log("RS: ");
                        console.log(result);
                        const avg = result[0].average;
                        console.log("AVG: ");
                        console.log(avg);
                        JobApplicant.findOneAndUpdate(
                          {
                            userId: data.applicantId,
                          },
                          {
                            $set: {
                              rating: avg,
                            },
                          }
                        )
                          .then((applicant) => {
                            if (applicant === null) {
                              res.status(400).json({
                                message: "Lỗi khi cập nhật đánh giá",
                              });
                              return;
                            }
                            res.json({
                              message: "Thêm đánh giá thành công",
                            });
                          })
                          .catch((err) => {
                            res.status(400).json(err);
                          });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message:
                    "Người nộp đơn không làm việc dưới quyền của bạn. Do đó bạn không thể đưa ra đánh giá.",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          rating.rating = data.rating;
          rating
            .save()
            .then(() => {
              // get the average of ratings
              Rating.aggregate([
                {
                  $match: {
                    receiverId: mongoose.Types.ObjectId(data.applicantId),
                    category: "applicant",
                  },
                },
                {
                  $group: {
                    _id: {},
                    average: { $avg: "$rating" },
                  },
                },
              ])
                .then((result) => {
                  // update the user's rating
                  if (result === null) {
                    res.status(400).json({
                      message: "Lỗi khi đánh giá",
                    });
                    return;
                  }
                  const avg = result[0].average;
                  JobApplicant.findOneAndUpdate(
                    {
                      userId: data.applicantId,
                    },
                    {
                      $set: {
                        rating: avg,
                      },
                    }
                  )
                    .then((applicant) => {
                      if (applicant === null) {
                        res.status(400).json({
                          message:
                            "Lỗi khi cập nhật đánh giá trung bình của người nộp đơn",
                        });
                        return;
                      }
                      res.json({
                        message: "Đã cập nhật đánh giá thành công",
                      });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    // applicant can rate job
    Rating.findOne({
      senderId: user._id,
      receiverId: data.jobId,
      category: "job",
    })
      .then((rating) => {
        console.log(user._id);
        console.log(data.jobId);
        console.log(rating);
        if (rating === null) {
          console.log(rating);
          Application.countDocuments({
            userId: user._id,
            jobId: data.jobId,
            status: {
              $in: ["accepted", "finished"],
            },
          })
            .then((acceptedApplicant) => {
              if (acceptedApplicant > 0) {
                // add a new rating

                rating = new Rating({
                  category: "job",
                  receiverId: data.jobId,
                  senderId: user._id,
                  rating: data.rating,
                });

                rating
                  .save()
                  .then(() => {
                    // get the average of ratings
                    Rating.aggregate([
                      {
                        $match: {
                          receiverId: mongoose.Types.ObjectId(data.jobId),
                          category: "job",
                        },
                      },
                      {
                        $group: {
                          _id: {},
                          average: { $avg: "$rating" },
                        },
                      },
                    ])
                      .then((result) => {
                        if (result === null) {
                          res.status(400).json({
                            message: "Lỗi khi tính đánh giá",
                          });
                          return;
                        }
                        const avg = result[0].average;
                        Job.findOneAndUpdate(
                          {
                            _id: data.jobId,
                          },
                          {
                            $set: {
                              rating: avg,
                            },
                          }
                        )
                          .then((foundJob) => {
                            if (foundJob === null) {
                              res.status(400).json({
                                message:
                                  "Lỗi khi cập nhật đánh giá trung bình của công việc",
                              });
                              return;
                            }
                            res.json({
                              message: "Thêm đánh giá thành công",
                            });
                          })
                          .catch((err) => {
                            res.status(400).json(err);
                          });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                // you cannot rate
                res.status(400).json({
                  message:
                    "Bạn chưa từng làm công việc này. Do đó bạn không thể đưa ra đánh giá.",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          // update the rating
          rating.rating = data.rating;
          rating
            .save()
            .then(() => {
              // get the average of ratings
              Rating.aggregate([
                {
                  $match: {
                    receiverId: mongoose.Types.ObjectId(data.jobId),
                    category: "job",
                  },
                },
                {
                  $group: {
                    _id: {},
                    average: { $avg: "$rating" },
                  },
                },
              ])
                .then((result) => {
                  if (result === null) {
                    res.status(400).json({
                      message: "Lỗi khi đánh giá",
                    });
                    return;
                  }
                  const avg = result[0].average;
                  console.log(avg);

                  Job.findOneAndUpdate(
                    {
                      _id: data.jobId,
                    },
                    {
                      $set: {
                        rating: avg,
                      },
                    }
                  )
                    .then((foundJob) => {
                      if (foundJob === null) {
                        res.status(400).json({
                          message:
                            "Lỗi khi cập nhật đánh giá trung bình của công việc",
                        });
                        return;
                      }
                      res.json({
                        message: "Đánh giá thành công",
                      });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

router.post("/payment", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại!",
          });
          return;
        }
        if (data.credit) {
          recruiter.credit = parseInt(data.credit) + parseInt(recruiter.credit);
        }
        if (data.paymentCard) {
          recruiter.paymentCard = data.paymentCard;
        }
        recruiter
          .save()
          .then(() => {
            let payment = new Payment({
              userId: data._id,
              paymentCard: data.paymentCard,
              credit: data.redit,
            });

            payment
              .save()
              .then(() => {
                res.json({
                  message: `Bạn đã nạp thành công!`,
                });
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại!",
          });
          return;
        }
        if (data.credit) {
          jobApplicant.credit =
            parseInt(data.credit) + parseInt(jobApplicant.credit);
        }
        if (data.paymentCard) {
          jobApplicant.paymentCard = data.paymentCard;
        }
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            let payment = new Payment({
              userId: data.userId,
              paymentCard: data.paymentCard,
              credit: data.credit,
            });

            payment
              .save()
              .then(() => {
                res.json({
                  message: `Bạn đã nạp thành công!`,
                });
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// Bài viết
router.post("/news", jwtAuth, (req, res) => {
  const user = req.user;

  if (user.type != "admin") {
    res.status(401).json({
      message: "Bạn không có quyền thêm công việc!",
    });
    return;
  }

  const data = req.body;

  let news = new News({
    userId: user._id,
    title: data.title,
    img: data.img,
    content: data.content,
    majors: data.majors,
    dateOfPosting: data.dateOfPosting,
  });

  news
    .save()
    .then(() => {
      res.json({ message: "Bài viết đã được tạo thành công!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/news", jwtAuth, (req, res) => {
  const news = News.find().then((news) => {
    res.json(news);
  });
});

router.get("/news/:id", jwtAuth, (req, res) => {
  News.findOne({ _id: req.params.id })
    .then((news) => {
      if (news == null) {
        res.status(400).json({
          message: "Bài viết không tồn tại!",
        });
        return;
      }
      res.json(news);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.put("/news/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "Bạn không có quyền thay đổi chi tiết bài viết!",
    });
    return;
  }
  News.findOne({
    _id: req.params.id,
    userId: user.id,
  })
    .then((news) => {
      if (news == null) {
        res.status(404).json({
          message: "Công việc không tồn tại!",
        });
        return;
      }
      const data = req.body;
      if (data.title) {
        news.title = data.title;
      }
      if (data.img) {
        news.img = data.img;
      }
      if (data.content) {
        news.content = data.content;
      }
      news
        .save()
        .then(() => {
          res.json({
            message: "Bài viết đã được cập nhật thành công!",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete("/news/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "admin") {
    res.status(401).json({
      message: "Bạn không được quyền xóa bài viết!",
    });
    return;
  }
  News.findOneAndDelete({
    _id: req.params.id,
    userId: user.id,
  })
    .then((news) => {
      if (news === null) {
        res.status(401).json({
          message: "Bạn không có quyền xóa bài viết!",
        });
        return;
      }
      res.json({
        message: "Bài viết đã được xóa thành công!",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
