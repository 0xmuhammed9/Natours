import express from 'express';
import { getView, getTour } from '../controllers/view-controller.js';

const viewRouter = express.Router();

viewRouter.get('/', getView);
viewRouter.get('/tour', getTour);

export default viewRouter;
