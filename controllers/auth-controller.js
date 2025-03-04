import usersModel from '../models/users-model.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { promisify } from 'util';
import sendEmail from '../utils/email.js';
import crypto from 'node:crypto';

/**
 * ************************************************************************************************************************
 *                                                For Token Generation
 * ************************************************************************************************************************
 */

const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = getToken(user._id);
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;
  res.cookie('jwt', token, cookiesOptions);

  user.password = undefined;
  user.passwordConfirm = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

/**
 * ************************************************************************************************************************
 *                                                For User Authentication (APIs)
 * ************************************************************************************************************************
 */

const signupUser = catchAsync(async (req, res) => {
  const newUser = await usersModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    photo: req.body.photo,
  });
  createSendToken(newUser, 201, res);
});

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await usersModel.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const correctPass = await user.correctPassword(password, user.password);
  if (!correctPass) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
});

const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await usersModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

    const html = `
      <p>Forgot your password?</p>
      <p>Submit a PATCH request with your new password and passwordConfirm to: <a href="${resetURL}">${resetURL}</a></p>
      <p>If you didn't forget your password, please ignore this email.</p>
    `;
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Token (valid for 10 minutes)',
      message,
      html,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  //1) Get User Based on Token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await usersModel.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpired: { $gt: Date.now() },
  });
  //2) If Token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token is Invalid or has Expired', 400));
  user.password = req.body.password; // Update Password
  user.passwordConfirm = req.body.passwordConfirm; // Update Confirmed Password
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpired = undefined;
  await user.save();
  //3) Log the user in, send JWT
  createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from collection
  console.log(req.user.id);
  console.log(req.user._id);
  const user = await usersModel.findById(req.user.id).select('+password');
  const correctPass = await user.correctPassword(
    req.body.password,
    user.password
  );
  //2) Check if POSTed Current Password is correct
  if (!correctPass)
    return next(
      new AppError(
        'Password is Incorrect, Please enter the Correct Password',
        400
      )
    );
  //3) if So, Update the Password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4) Log User in, Send JWT
  createSendToken(user, 200, res);
});

/**
 * ************************************************************************************************************************
 *                                                For User Authentication (Middlewares)
 * ************************************************************************************************************************
 */
const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await usersModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The current user belonging to this token does no longer exist.',
        401
      )
    );
  }
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  req.user = currentUser;
  next();
});

const isRestricted = (roles) => {
  return (req, res, next) => {
    // For debugging
    console.log('User role:', req.user.role);
    console.log('Allowed roles:', roles);

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

export {
  signupUser,
  loginUser,
  protect,
  isRestricted,
  forgetPassword,
  resetPassword,
  updatePassword,
  isLoggedIn,
};
