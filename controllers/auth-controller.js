import usersModel from '../models/users-model.js';
import catchAsync from '../utils/catchAsync.js';

const signupUser = catchAsync(async (req, res) => {
    const newUser = await usersModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
});


export default signupUser;
