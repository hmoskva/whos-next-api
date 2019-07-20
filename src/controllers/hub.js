const Joi = require('joi');
const Hub = require('../models/hub');
const StatusError = require('../helpers/errors');

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
    const hub = await Hub.findOne({slug});
    if (!hub) {
      return next(StatusError('Hub not found'));
    }
    return res.wrapJSON(hub);
  } catch (error) {
    return next(error);
  }
};

exports.findByID = async (req, res, next) => {
  try {
    const {id} = req.params;
    const hub = await Hub.findById(id);
    if (!hub) {
      return next(StatusError('Hub not found'));
    }
    return res.wrapJSON(hub);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string(),
      imageURL: Joi.string(),
      address: Joi.string(),
      createdBy: Joi.string(),
      confirmPurchase: Joi.boolean()
    });
    const {error, value} = Joi.validate(req.body, schema);
    if (error) {
      return next(error);
    }
    const {hubID} = req.params;
    let hub = await Hub.findById(hubID);
    if (req.user.id !== hub.createdBy) {
      return next(StatusError('Not Authorized'));
    }
    Object.keys(value).forEach(key => {
      hub[key] = value[key];
    });
    hub = await hub.save();
    return res.wrapJSON(hub);
  } catch (error) {
    return next(error);
  }
};

exports.updateActiveStatus = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      active: Joi.boolean().required()
    });
    const {error, value} = Joi.validate(req.body, schema);
    if (error) {
      return next(error);
    }
    const {hubID} = req.params;
    let hub = await Hub.findById(hubID);
    if (req.user.id !== hub.createdBy) {
      return next(StatusError('Not Authorized'));
    }
    hub.active = value.active;
    hub = await Hub.save();
    return res.wrapJSON(hub);
  } catch (error) {
    return next(error);
  }

};