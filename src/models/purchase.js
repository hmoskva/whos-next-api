const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  item: mongoose.Types.ObjectId('Item'),
  purchasedBy: mongoose.Types.ObjectId('User'),
  confirmed: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

module.exports = mongoose.model('Purchase', purchaseSchema);