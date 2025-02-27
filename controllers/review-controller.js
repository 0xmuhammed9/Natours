import Review from '../models/reviews-model.js';
import { deleteOne, createOne, getAll, getOne, updateOne } from './handlerFactory.js';


/**
 * ******************************************************************************************************
 *                                                     Module Functions
 * ******************************************************************************************************
 */

const getAllReviews = getAll(Review);
const getOneReview = getOne(Review);
const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

export {
  createReview,
  getAllReviews,
  deleteReview,
  getOneReview,
  updateReview,
};
