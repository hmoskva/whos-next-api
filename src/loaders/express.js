const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("../api");

module.exports = ({ app }) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use(cors());
  // app.use(morgan("combined"));
  app.use("/api/v1", routes());

  app.use((req, res, next) => {
    const error = new Error("Not found");
    error.message = "Invalid route";
    error.status = 404;
    next(error);
  });
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
      status: false,
      message: error.message
    });
  });

  return app;
};
