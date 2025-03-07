import express from 'express';
import {
  signupUser,
  loginUser,
  logout,
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
import uploadUserImage from '../middleware/uploadImages.js';

const usersRoute = express.Router();
/**
 * ******************************************************************************************************
 *                                               User Routes
 * ******************************************************************************************************
 */

usersRoute.route('/signup').post(signupUser);
usersRoute.route('/login').post(loginUser);
usersRoute.route('/logout').get(logout);
usersRoute.route('/forget-password').post(forgetPassword);
usersRoute.route('/reset-password/:token').patch(resetPassword);
usersRoute.use(protect); // Protect all routes after this middleware
usersRoute.route('/update-password').patch(updatePassword);
usersRoute.route('/updateMe').patch(uploadUserImage, updateMe);
usersRoute.route('/deleteMe').delete(deleteMe);
usersRoute.route('/me').get(getMe, getUser);

/**
 * ******************************************************************************************************
 *                                               Admin Routes
 * ******************************************************************************************************
 */
usersRoute.use(isRestricted(['admin'])); // Protect all routes after this middleware
usersRoute.route('/').get(getAllUsers);
usersRoute.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

export default usersRoute;
