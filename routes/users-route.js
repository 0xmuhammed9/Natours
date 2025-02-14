import express from 'express';
import {
  signupUser,
  loginUser,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
} from '../controllers/auth-controller.js';
import { updateMe, deleteMe } from '../controllers/users-controller.js';

const usersRoute = express.Router();

usersRoute.route('/signup').post(signupUser);
usersRoute.route('/login').post(loginUser);
usersRoute.route('/forget-password').post(forgetPassword);
usersRoute.route('/reset-password/:token').patch(resetPassword);
usersRoute.route('/update-password').patch(protect, updatePassword);
usersRoute.route('/').get().post();
usersRoute.route('/updateMe').patch(protect, updateMe);
usersRoute.route('/deleteMe').delete(protect, deleteMe);
usersRoute.route('/:id').get().delete().patch();

export default usersRoute;
