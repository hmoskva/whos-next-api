const mongoose = require('mongoose');
const crypto = require('crypto-random-string');
const {slugify} = require('../helpers/utils');

const Schema = mongoose.Schema;

const hubSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  imageURL: String,
  address: String,
  latitude: {
    type: String,
    alias: 'lat'
  },
  longitude: {
    type: String,
    alias: 'long'
  },
  createdBy: mongoose.Types.ObjectId('User'),
  confirmPurchase: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {timestamps: true});

hubSchema.pre('save', async function (next) {
  if (this.isNew) {
    let slug = slugify(this.name);
    const existingSlug = await this.model('Hub').find({slug});
    if (existingSlug) {
      slug += crypto({length: 3});
    }
    this.slug = slug;
  }
  if (this.isModified('address')) {
    const {lat, long} = await this.getLatLng();
    this.lat = lat || '';
    this.long = long || '';
  }
  return next();
});

hubSchema.methods.getLatLng = async function () {
  try {
    // TODO
    return {lat: '', long: ''};
  } catch (e) {
    return null;
  }
};

module.exports = mongoose.model('Hub', hubSchema);