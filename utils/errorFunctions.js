import AppError from './appError.js';

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const castErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

export {
  sendErrorDev,
  sendErrorProd,
  castErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
  handleJWTError,
  handleJWTExpiredError,
};
