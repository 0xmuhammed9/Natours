import User from '../models/users-model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne, updateOne, getAll, getOne } from './handlerFactory.js';
import sendResponse from '../utils/sendResponse.js';

/**
 * ********************************************************************************************************************
 *                                                  Helper Functions
 * ********************************************************************************************************************
 */

const filterObj = (obj, ...allowedObj) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedObj.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/**
 * ********************************************************************************************************************
 *                                              User Controller Functions
 * ********************************************************************************************************************
 */
const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  sendResponse(res, 200, updatedUser);
});

const getMe = (req, res, next) => {
  if (!req.user) return next(new AppError('You are not logged in', 401));
  req.params.id = req.user.id;
  next();
};

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  sendResponse(res, 204, null);
});

/**
 * ******************************************************************************************************
 *                                         Admin Controller Functions
 * ******************************************************************************************************
 */

const getAllUsers = getAll(User);
const getUser = getOne(User);
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

export {
  updateMe,
  deleteMe,
  getMe,
  deleteUser,
  updateUser,
  getAllUsers,
  getUser,
};
