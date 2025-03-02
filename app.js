import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import toursRoute from './routes/tours-route.js';
import usersRoute from './routes/users-route.js';
import reviewsRoute from './routes/reviews-route.js';
import AppError from './utils/appError.js';
import errorHandler from './controllers/error-controller.js';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import DataSansitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'node:path';
import { cwd } from 'node:process';
import viewRouter from './routes/view-route.js';

const app = express();
dotenv.config();
app.set('view engine', 'pug');
app.set('views', path.join(path.resolve(), 'views'));
app.use(express.static(path.join(path.resolve(), 'public')));
// app.use(express.static(cwd() + '/public'));
// app.use(express.static(cwd() + '/views'));

/**
 * ***************************************************************************************************
 *                                   Global Middlewares
 * ***************************************************************************************************
 */
app.use(helmet());
app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
  })
);
app.use(express.json());
app.use(DataSansitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  })
);
app.use(morgan('dev'));

/**
 * ***************************************************************************************************
 *                                        Routes
 * ***************************************************************************************************
 */

app.use('/', viewRouter);
app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/reviews', reviewsRoute);

/**
 * ***************************************************************************************************
 *                                       Error Handling
 * ***************************************************************************************************
 */

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
