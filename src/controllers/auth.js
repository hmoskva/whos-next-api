const passport = require("passport");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-random-string");
const Joi = require("joi");
const config = require("../config");
const User = require("../models/user");

const StatusError = require("../helpers/errors");

require("../services/passport");

module.exports = {
  async signup(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required(),
      password: Joi.string().required(),
      phone: Joi.string().required()
    });
    const { error } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return next(error);
    }
    passport.authenticate("signup", async (err, user, info) => {
      try {
        if (err || !user) {
          return next(err);
        }
        const body = {
          email: user.email,
          phone: user.phone
        };
        return res.wrapJSON({
          message: info.msg,
          user: body
        });
      } catch (e) {
        return next(e);
      }
    })(req, res, next);
  },
  async login(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required(),
      password: Joi.string().required()
    });
    const { error } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return next(error);
    }
    passport.authenticate("login", async (pError, user) => {
      try {
        if (pError || !user) {
          return next(pError);
        }
        req.login(user, { session: false }, async err => {
          if (err) return next(err);
          const body = { id: user._id, email: user.email, role: user.role };
          const token = jwt.sign({ user: body }, config.get("secret"), {
            expiresIn: 100
          });
          return res.wrapJSON({
            token,
            refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
          });
        });
      } catch (e) {
        return next(e);
      }
    })(req, res, next);
  },
  async refreshToken(req, res, next) {
    try {
      const schema = Joi.object().keys({
        refreshToken: Joi.string().required()
      });
      const { error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return next(error);
      }
      // TODO: Get user refreshToken,
      return res.wrapJSON({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMywiZW1haWwiOiJsZXJlLmFraW53dW5taUBnbWFpbC5jb20ifSwiaWF0IjoxNTUzMjU1Njk4fQ.a-TUhV6lGAe4aaXNnciuJuYQU-WK8Ux0oXvtRTd3K1I",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
      });
    } catch (err) {
      return next(err);
    }
  },
  async confirmEmailToken(req, res, next) {
    try {
      const schema = Joi.object().keys({
        userID: Joi.string().required(),
        token: Joi.string().required()
      });
      const { value, error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return next(error);
      }
      const user = await User.findById(value.userID);
      if (!user) {
        return next(StatusError("userID does not match a registered user"));
      }
      if (user.emailConfirmed) {
        return next(new StatusError("User email confirmed"));
      }
      const token = await user.getVerificationToken();
      if (token.token === value.token) {
        try {
          await models.sequelize.transaction(async t => {
            await user.update({ emailConfirmed: true }, { transaction: t });
            await token.destroy({ transaction: t });
          });
          return res.wrapJSON({ message: "Email confirmed" });
        } catch (e) {
          return next(e);
        }
      } else {
        return next(new StatusError("Token incorrect"));
      }
    } catch (err) {
      return next(err);
    }
  },
  async resetPassword(req, res, next) {
    try {
      const schema = Joi.object().keys({
        email: Joi.string()
          .email({ minDomainAtoms: 2 })
          .required()
      });
      const { value, error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return next(error);
      }
      // Check email
      const user = await User.findOne({
        where: {
          email: value.email
        }
      });
      if (!user) {
        return next(new StatusError("Email does not match a registered user"));
      }
      // If mail exists, create token and send password reset email
      const token = await VerificationToken.findOrCreate({
        where: { UserId: user.id },
        defaults: { token: crypto({ length: 16 }) }
      });

      emailQueue.add(
        {
          to: user.email,
          subject: "Password Reset",
          templateName: "passwordReset",
          data: {
            chakaID: user.chakaID,
            token: token[0].dataValues.token
          }
        },
        { removeOnComplete: true }
      );
      return res.wrapJSON({
        message: "Password reset email sent"
      });
    } catch (err) {
      return next(err);
    }
  },
  async resetPasswordConfirm(req, res, next) {
    try {
      const schema = Joi.object().keys({
        chakaID: Joi.number()
          .integer()
          .required(),
        newPassword: Joi.string().required(),
        token: Joi.string().required()
      });
      const { value, error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return next(error);
      }
      const user = await User.findOne({
        where: {
          chakaID: value.chakaID
        }
      });
      if (!user) {
        return next(
          new StatusError("chakaID does not match a registered user")
        );
      }
      const token = await user.getVerificationToken();
      if (token && token.token === value.token) {
        try {
          await models.sequelize.transaction(async t => {
            await user.update(
              { passwordHash: value.newPassword },
              { transaction: t }
            );
            await token.destroy({ transaction: t });
          });
          return res.wrapJSON({ message: "Password changed successfully" });
        } catch (e) {
          return next(e);
        }
      } else {
        return next(new StatusError("Token incorrect"));
      }
    } catch (err) {
      return next(err);
    }
  }
};
