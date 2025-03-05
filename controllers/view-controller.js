import Tour from '../models/tours-model.js';
import catchAsync from '../utils/catchAsync.js';

const getView = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours Overview',
    tours,
    user: req.user,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
    user: req.user,
  });
});

const login = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
    user: req.user,
  });
});
const signup = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Create your account',
    user: req.user,
  });
});

export { getTour, getView, login, signup };
