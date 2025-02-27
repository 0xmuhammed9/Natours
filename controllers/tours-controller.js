import Tour from '../models/tours-model.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';


/**
 * ******************************************************************************************************
 *                                                     Module Functions
 * ******************************************************************************************************
 */

const getAllTour = getAll(Tour);
const getTour = getOne(Tour, { path: 'reviews' });
const addTour = createOne(Tour);
const updateTour = updateOne(Tour);
const deleteTour = deleteOne(Tour);

export { getAllTour, getTour, updateTour, deleteTour, addTour };
