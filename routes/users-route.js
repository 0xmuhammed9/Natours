import express from 'express';
import {
  signupUser,
  loginUser,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
  isRestricted,
} from '../controllers/auth-controller.js';
import {
  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
  getAllUsers,
  getUser,
  getMe,
} from '../controllers/users-controller.js';

const usersRoute = express.Router();

/**
 * ******************************************************************************************************
 *                                               User Controller Functions
 * ******************************************************************************************************
 */

usersRoute.route('/signup').post(signupUser);
usersRoute.route('/login').post(loginUser);
usersRoute.route('/forget-password').post(forgetPassword);
usersRoute.route('/reset-password/:token').patch(resetPassword);
usersRoute.route('/update-password').patch(protect, updatePassword);
usersRoute.route('/updateMe').patch(protect, updateMe);
usersRoute.route('/deleteMe').delete(protect, deleteMe);
usersRoute.route('/me').get(protect, getMe, getUser);

/**
 * ******************************************************************************************************
 *                                               Admin Controller Functions
 * ******************************************************************************************************
 */
usersRoute.route('/').get(protect, isRestricted(['admin']), getAllUsers);
usersRoute
  .route('/:id')
  .get(protect, isRestricted(['admin']), getUser)
  .delete(protect, isRestricted(['admin']), deleteUser)
  .patch(protect, isRestricted(['admin']), updateUser);

export default usersRoute;
