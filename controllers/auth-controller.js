import usersModel from '../models/users-model.js';

const signupUser = async (req, res) => {
  try {
    const newUser = await usersModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
}; 


export default signupUser;
