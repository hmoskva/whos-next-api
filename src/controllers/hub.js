const Joi = require('joi');
const Hub = require('../models/hub');

exports.create = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      imageURL: Joi.string(),
      address: Joi.string(),
      createdBy: Joi.string(),
      confirmPurchase: Joi.boolean()
    });
    const {error, value} = Joi.validate(req.body, schema);
    if (error) {
      return next(error);
    }
    const hub = new Hub(value);
    await hub.save();
    return res.wrapJSON(hub);
  } catch (error) {
    return next(error);
  }
};

exports.findBySlug = async (req, res, next) => {
  try {
    const {slug} = req.params;
  } catch (error) {
  }
};