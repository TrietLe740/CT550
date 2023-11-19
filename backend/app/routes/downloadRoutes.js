const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/resume/:file", (req, res) => {
  const address = path.join(
    __dirname,
    `../../public/resume/${req.params.file}`
  );
  console.log(address);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        message: "Đã có lỗi khi tải xuống CV",
      });
      return;
    }
    res.download(address);
  });
});

module.exports = router;
