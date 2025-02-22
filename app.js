import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import toursRoute from './routes/tours-route.js';
import usersRoute from './routes/users-route.js';
import AppError from './utils/appError.js';
import errorHandler from './controllers/error-controller.js';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import DataSansitize from 'express-mongo-sanitize';
import hpp from 'hpp';
const app = express();
dotenv.config();

// Middleware
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

// Routes
app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;
