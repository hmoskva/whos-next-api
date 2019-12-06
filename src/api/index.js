const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../docs");
const AuthRouter = require("./routes/auth.routes");

module.exports = () => {
  const app = express.Router();
  app.get("/", (req, res) => {
    return res.json({
      msg: "Welcome to Knex.IO",
      domain: "https://knext-io.herokuapp.com",
      routes: {
        auth: "/auth"
      }
    });
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/auth", AuthRouter);
  return app;
};
