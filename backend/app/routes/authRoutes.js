const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Admin = require("../db/Admin");

const jwtAuth = require("../lib/jwtAuth");

const router = express.Router();

router.post("/signup", (req, res) => {
  const data = req.body;
  let user = new User({
    email: data.email,
    password: data.password,
    type: data.type,
  });

  user
    .save()
    .then(() => {
      const userDetails =
        user.type == "recruiter"
          ? new Recruiter({
              userId: user._id,
              name: data.name,
              role: data.role,
              companyName: data.companyName,
              companyMail: "",
              website: "",
              bio: "",
              contactNumber: data.contactNumber,
              location: [],
              avatar: "",
              level: 0,
              notification: [],
              follower: [],
              credit: 0,
            })
          : new JobApplicant({
              userId: user._id,
              name: data.name,
              rating: [],
              avatar: "",
              major: "",
              school: {},
              contactNumber: "",
              // socialLink: data.socialLink,
              // skills: data.skills,
              // activities: data.activities,
              // certificates: data.certificates,
              // awards: data.awards,
              // target: data.target,
              // exp: data.exp,
              // interest: data.interest,
              resume: [],
              level: 0,
              notification: [],
              following: [],
              credit: 0,
            });

      userDetails
        .save()
        .then(() => {
          // Token
          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          res.json({
            token: token,
            type: user.type,
          });
        })
        .catch((err) => {
          user
            .delete()
            .then(() => {
              res.status(400).json(err);
            })
            .catch((err) => {
              res.json({ error: err });
            });
          err;
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        info.message = "Hãy cung cấp đầy đủ thông tin để đăng nhập";
        console.log(info);
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

router.get("/auth", jwtAuth, (req, res) => {
  let user = req.user;

  const id = req.user._id;
  const type = req.user.type;
  if (type === "applicant") {
    JobApplicant.findOne({ userId: id }).then((kq) => {
      user = {
        ...user.toObject(),
        ...kq.toObject(),
      };
      res.json(user);
    });
  } else if (type === "recruiter") {
    Recruiter.findOne({ userId: id }).then((kq) => {
      user = {
        ...user.toObject(),
        ...kq.toObject(),
      };
      res.json(user);
    });
  } else if (type === "admin") {
    console.log("ID " + id);
    Admin.findOne({ userId: id }).then((kq) => {
      user = {
        ...user.toObject(),
        ...kq.toObject(),
      };
      res.json(user);
    });
  }
});

module.exports = router;
