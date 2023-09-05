const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const apiRouter = require("./app/routes/apiRoutes");
const authRouter = require("./app/routes/authRoutes");

const app = express();

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use("/api", apiRouter);
app.use("/auth", authRouter);
// app.use(passportConfig.initialize());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to my app." });
});

// 404
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// 5xx
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
