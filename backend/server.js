const app = require("./app");
const MongoDB = require("./app/utils/mongodb.util.js");
const config = require("./app/config");
const bodyParser = require("body-parser");

const fs = require("fs");

async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connected to the database!");

    const PORT = config.app.port;
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.log("Can't connect to the database!", error);
    process.exit();
  }

  if (!fs.existsSync("./public")) {
    fs.mkdirSync("./public");
  }
  if (!fs.existsSync("./public/resume")) {
    fs.mkdirSync("./public/resume");
  }
  if (!fs.existsSync("./public/profile")) {
    fs.mkdirSync("./public/profile");
  }
}

startServer();
