import express from 'express';

const usersRoute = express.Router();

usersRoute.route('/').get().post();
usersRoute.route('/:id').get().delete().patch();

export default usersRoute;
