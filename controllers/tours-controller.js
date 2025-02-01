import Tour from '../models/tours-model.js';
import APIQuery from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';

/**
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @param {import ('express').NextFunction} next
 */
const getAllTour = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @param {import ('express').NextFunction} next
 */
const getTour = async (req, res, next) => {
  try {
    const fields = req.query.fields
      ? req.query.fields.split(',').join(' ')
      : '-__v';
    const findTour = await Tour.findById(req.params.id).select(fields);
    if (!findTour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
      status: 'Success',
      data: {
        findTour,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @param {import ('express').NextFunction} next
 */
const addTour = async (req, res, next) => {
  try {
    const CreatedCar = await Tour.create(req.body);
    res.status(200).json({
      status: 'Success',
      data: {
        CreatedCar,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @param {import ('express').NextFunction} next
 */
const updateTour = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @param {import ('express').NextFunction} next
 */
const deleteTour = async (req, res, next) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export { getAllTour, getTour, updateTour, deleteTour, addTour };
