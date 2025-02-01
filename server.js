import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT;
const NATOURS_DB = process.env.DATABASE_URL;

mongoose.connect(NATOURS_DB).then(() => {
  console.log('Connected to the Database Successfully :)');
});

const server = app.listen(PORT, () => {
  console.log(`We're Listening on Port:${PORT}`);
});
