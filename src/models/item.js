const mongoose = require('mongoose');
const crypto = require('crypto-random-string');
const {slugify} = require('../helpers/utils');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  imageURL: String,
  price: Number,
  hub: {
    type: Schema.ObjectId,
    ref: 'Hub'
  },
  currentTurn: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {timestamps: true});

itemSchema.pre('save', async function (next) {
  if (this.isNew) {
    let slug = slugify(this.name);
    const existingSlug = await this.model('Item').find({slug});
    if (existingSlug) {
      slug += crypto({length: 3});
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);