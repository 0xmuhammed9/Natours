import mongoose from 'mongoose';
import validator from 'validator';

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
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
  photo: {
    type: String,
  },
});

const User = mongoose.model('User', usersSchema);

export default User;
