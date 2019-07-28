const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  item: {
    type: Schema.ObjectId,
    ref: 'Item'
  },
  purchasedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  confirmed: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

module.exports = mongoose.model('Purchase', purchaseSchema);