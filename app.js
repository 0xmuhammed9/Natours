import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import toursRoute from './routes/tours-route.js';
import usersRoute from './routes/users-route.js';
import AppError from './utils/appError.js';
import errorHandler from './controllers/error-controller.js';
import { protect } from './controllers/auth-controller.js';

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

// Routes
app.use('/api/v1/tours',protect ,toursRoute);
app.use('/api/v1/users', usersRoute);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

});



// Global error handler
app.use(errorHandler);

export default app;
