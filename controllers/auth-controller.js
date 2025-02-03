import usersModel from '../models/users-model.js';
import catchAsync from '../utils/catchAsync.js';

const signupUser = catchAsync(async (req, res) => {
  const newUser = await usersModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export default signupUser;
