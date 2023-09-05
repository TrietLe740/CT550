const mongoose = require("mongoose");

// MongoDB
class MongoDB {
  static connect = async (uri) => {
    if (this.client) return this.client;
    this.client = await mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .catch((err) => console.log(err));
    return this.client;
  };
}

module.exports = MongoDB;
