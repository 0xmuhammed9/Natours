/**
 *  ------------- Modules -------------
 */
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import toursRoute from './routes/tours-route.js';
import usersRoute from './routes/users-route.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
/**
 * Tours Routing
 */
app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/tour/:id', toursRoute);

/**
 * UserRouting
 */
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/users/:id', usersRoute);

export default app;
