import express from 'express';
import signupUser from '../controllers/auth-controller.js';
import { createUser } from '../controllers/users-controller.js';

const usersRoute = express.Router();

usersRoute.route('/signup').post(signupUser);

usersRoute.route('/').get().post(createUser);
usersRoute.route('/:id').get().delete().patch();

export default usersRoute;
