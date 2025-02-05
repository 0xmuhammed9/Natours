import usersModel from '../models/users-model.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { promisify } from 'util';

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
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
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

  if (!user) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const correctPass = await user.correctPassword(password, user.password);

  if (!correctPass) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is ok, send token to client
  const token = getToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
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
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) Check if user still exists
  const currentUser = await usersModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The current user belonging to this token does no longer exist.',
        401
      )
    );
  }
  //4) Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // 5) Grant access to protected route
  req.user = currentUser;
  next();
});

const isRestricted = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      console.log(req.user.role);
      console.log(roles.includes(req.user.role));
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next(); // This will allow the request to proceed if role is authorized
  };
};

export { signupUser, loginUser, protect, isRestricted };
