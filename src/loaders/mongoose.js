const mongoose = require("mongoose");
const config = require("../config");

module.exports = async () => {
  try {
    const connection = await mongoose.connect(config.databaseUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log("MongoDb Connected");
    return connection.connection.db;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
