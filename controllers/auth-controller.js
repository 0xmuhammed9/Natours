import usersModel from '../models/users-model.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signupUser = catchAsync(async (req, res) => {
  const newUser = await usersModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = getToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await usersModel.findOne({ email }).select('+password');
  const correctPass = await user.correctPassword(password, user.password);
  //3) If everything is ok, send token to client
  if (!user || !correctPass) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // send token to client
  const token = getToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

const protect = catchAsync((req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  //2) Verification of token

  //3) Check if user still exists

  //4) Check if user changed password after the token was issued

  next();
});

export { signupUser, loginUser,protect};
