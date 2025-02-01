import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT;
const NATOURS_DB = process.env.DATABASE_URL;

mongoose.connect(NATOURS_DB).then(() => {
  console.log('Connected to the Database Successfully :)');
});

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development')
    console.log(`We're Listening on Port:${PORT}, Development Mode`);
  else if (process.env.NODE_ENV === 'production')
    console.log(`We're Listening on Port:${PORT}, Production Mode`);
});
