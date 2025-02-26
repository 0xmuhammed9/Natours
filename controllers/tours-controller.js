import Tour from '../models/tours-model.js';
import APIQuery from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne } from './handlerFactory.js';

/**
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @param {import ('express').NextFunction} next
 */
const getAllTour = catchAsync(async (req, res, next) => {
  const Query = new APIQuery(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();
  const tours = await Query.query;
  res.status(200).json({
    status: 'Success',
    data: {
      tours,
    },
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const fields = req.query.fields
    ? req.query.fields.split(',').join(' ')
    : '-__v';
  const findTour = await Tour.findById(req.params.id)
    .select(fields)
    .populate('reviews');
  if (!findTour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      findTour,
    },
  });
});

const addTour = catchAsync(async (req, res, next) => {
  const createdTour = await Tour.create(req.body);
  res.status(200).json({
    status: 'Success',
    data: {
      createdTour,
    },
  });
});

/**
 *
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @param {import ('express').NextFunction} next
 */
const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      updatedTour,
    },
  });
});


const deleteTour = deleteOne(Tour);
 

export { getAllTour, getTour, updateTour, deleteTour, addTour };
