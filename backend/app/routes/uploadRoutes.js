const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");

const pipeline = promisify(require("stream").pipeline);
const path = require("path");

const router = express.Router();
const jwtAuth = require("../lib/jwtAuth");
const JobApplicant = require("../db/JobApplicant");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/resume");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix =
        Date.now() +
        "-" +
        (Math.round(Math.random() * 1e9) + path.extname(file.originalname));
      // console.log(file);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
    fileFilter: function (_req, file, cb) {
      checkFileType(file, cb);
    },
  }),
});

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}

router.post("/resume", upload.single("file"), jwtAuth, async (req, res) => {
  try {
    const UID = req.user._id;
    const { file: CV } = req;
    console.log(CV);
    await JobApplicant.findOneAndUpdate({ userId: UID }, { resume: [CV] });
    res.status(200).json({
      message: "Tải lên thành công",
    });
  } catch (e) {
    res.status(500).json({
      message: "Lỗi tải lên",
    });
  }
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    file.detectedFileExtension != ".jpg" &&
    file.detectedFileExtension != ".png"
  ) {
    res.status(400).json({
      message: "Sai định dạng",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
      .then(() => {
        res.send({
          message: "Ảnh của bạn đã được tải lên",
          url: `/host/profile/${filename}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Lỗi khi tải lên",
        });
      });
  }
});

module.exports = router;
