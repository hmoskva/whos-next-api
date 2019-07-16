const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {roleChoices} = require('../helpers/choices').userModelChoices;
const {emailValidator} = require('../helpers/validators');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: [emailValidator, 'Please enter a valid email']
  },
  phone: {
    type: String,
    minlength: 11,
    maxlength: 14,
    unique: true,
    required: true
  },
  name: String,
  password: String,
  avatarURL: String,
  role: {
    type: String,
    enum: [...Object.values(roleChoices)],
    default: roleChoices.regular
  },
  isActive: Boolean,
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  emailNotifications: {
    type: Boolean,
    default: true
  }

}, {timestamps: true});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
  return next();
});

userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compareSync(password, this.password); // TODO: change to compare on prod
  return compare;
};

module.exports = mongoose.model('User', userSchema);