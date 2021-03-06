const express = require("express");
const authController = require("../../controllers/auth");

const authRouter = express.Router();

authRouter.route("/signup").post(authController.signup);
authRouter.route("/login").post(authController.login);

module.exports = authRouter;
