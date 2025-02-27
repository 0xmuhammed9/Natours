import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIQuery from '../utils/apiFeatures.js';
import sendResponse from '../utils/sendResponse.js';

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const Query = new APIQuery(Model.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();
    const doc = await Query.query;
    sendResponse(res, 200, doc);
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    sendResponse(res, 200, doc);
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    sendResponse(res, 204, null);
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError('No document found with that ID', 404));
    sendResponse(res, 200, doc);
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    sendResponse(res, 201, doc);
  });

export { getAll, deleteOne, updateOne, createOne, getOne };
