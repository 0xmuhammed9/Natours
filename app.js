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
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

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
app.use(cookieParser());
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
