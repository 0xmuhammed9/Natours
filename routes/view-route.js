import express from 'express';
import { getView, getTour, login } from '../controllers/view-controller.js';

const viewRouter = express.Router();

viewRouter.get('/', getView);
viewRouter.get('/tour/:slug', getTour);
viewRouter.get('/login', login);

export default viewRouter;
