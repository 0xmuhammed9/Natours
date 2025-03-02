import Tour from '../models/tours-model.js';
import catchAsunc from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const getView = catchAsunc(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours Overview',
    tours,
  });
});

const getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};

export { getTour, getView };
