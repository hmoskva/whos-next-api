const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");

module.exports = async ({ expressApp }) => {
  try {
    await Promise.all([mongooseLoader(), expressLoader({ app: expressApp })]);
  } catch (error) {
    console.log(error, "err");
  }
};
