const mongoose = require('mongoose');
const {statusChoices} = require('../helpers/choices').membershipModelChoices;

const Schema = mongoose.Schema;

const membershipSchema = new Schema({
  member: mongoose.Types.ObjectId('User'),
  hub: mongoose.Types.ObjectId('Hub'),
  position: Number,
  status: {
    type: String,
    enum: [...Object.values(statusChoices)]
  }
}, {timestamps: true});

membershipSchema.pre('save', async function (next) {
  if (this.isNew) {
    // set new member position to max position + 1
    const lastTurn = await this.model('Membership')
      .find({hub: this.hub, status: statusChoices.active})
      .sort({position: -1})
      .limit(1);
    this.position = lastTurn.position + 1;
  }
  return next();
});

module.exports = mongoose.model('Membership', membershipSchema);