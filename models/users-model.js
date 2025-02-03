import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

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
  photo: {
    type: String,
  },
});

usersSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password,10);
  this.passwordConfirm = undefined;
  next();
})

usersSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', usersSchema);

export default User;
