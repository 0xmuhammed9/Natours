import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

/**
 * *********************************************************************************************************************************************************
 *                                                                Model Schema
 * *********************************************************************************************************************************************************
 */
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    trim: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must confirm password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetTokenExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/**
 * *********************************************************************************************************************************************************
 *                                                                Model Middleware
 * *********************************************************************************************************************************************************
 */
usersSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 10
  this.password = await bcrypt.hash(this.password, 10);
  // Set passwordChangedAt if password is modified (not on new document)
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

usersSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

/**
 * *********************************************************************************************************************************************************
 *                                                                Model Methods
 * *********************************************************************************************************************************************************
 */
usersSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

usersSchema.methods.createPasswordResetToken = function () {
  const userToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(userToken)
    .digest('hex');

  this.passwordResetTokenExpired = Date.now() + 10 * 60 * 1000;

  return userToken;
};

usersSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', usersSchema);

export default User;
