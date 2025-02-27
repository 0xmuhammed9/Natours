const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: 'Success',
    data: data,
  });
};

export default sendResponse;
