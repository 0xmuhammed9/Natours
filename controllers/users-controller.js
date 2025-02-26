import User from '../models/users-model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne, updateOne } from './handlerFactory.js';

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
  return newObj; // Move return statement outside forEach
};

/**
 * ********************************************************************************************************************
 *                                                  Controller Functions
 * ********************************************************************************************************************
 */
const updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTs password Data.
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  //2) Filter unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  //3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

export { updateMe, deleteMe, deleteUser, updateUser };
