import AppError from '../utils/appError.js';
/**
 * @param {import ('../utils/appError').default} err
 * @param {import ('express').Response} res
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * @param {import ('express').Response} res
 * @param {import ('../utils/appError').default} err
 */
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
}

const handleDuplicateFieldsDB = (err) =>{
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
  return new AppError(message, 400);
}

const handleValidationErrorDB = (err) =>{
  const message =  Object.values(err.errors).map(el => el.message).join('. ');
  return new AppError(message, 400);
}

/**
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @param {import ('express').NextFunction} next
 * @param {import ('../utils/appError').default} err
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = Object.create(Object.getPrototypeOf(err));
    Object.assign(error, err);
    if(error.name === 'CastError') error = castErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
    
    sendErrorProd(error, res);
  }
};

export default errorHandler;
