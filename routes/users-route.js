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
usersRoute.use(protect); // Protect all routes after this middleware
usersRoute.route('/update-password').patch(updatePassword);
usersRoute.route('/updateMe').patch(updateMe);
usersRoute.route('/deleteMe').delete(deleteMe);
usersRoute.route('/me').get(getMe, getUser);

/**
 * ******************************************************************************************************
 *                                               Admin Controller Functions
 * ******************************************************************************************************
 */
usersRoute.use(isRestricted(['admin'])); // Protect all routes after this middleware
usersRoute.route('/').get(getAllUsers);
usersRoute.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

export default usersRoute;
