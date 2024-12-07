/**
 *
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 */
const getAllTour = async (req, res) => {
  try {
    res.status(200).json({
      status: 'Success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
    });
  }
};

/**
 *
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 */
const getTour = async (req, res) => {
  try {
    res.status(200).json({
      status: 'Success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
    });
  }
};

const addTour = async (req, res) => {
    try {
      res.status(200).json({
        status: 'Success',
      });
    } catch (err) {
      res.status(404).json({
        status: 'Fail',
      });
    }
  };

/**
 *
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 */
const updateTour = async (req, res) => {
    try {
      res.status(200).json({
        status: 'Success',
      });
    } catch (err) {
      res.status(404).json({
        status: 'Fail',
      });
    }
  };

  /**
 *
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 */
const deleteTour = async (req, res) => {
    try {
      res.status(200).json({
        status: 'Success',
      });
    } catch (err) {
      res.status(404).json({
        status: 'Fail',
      });
    }
  };

export { getAllTour,getTour,updateTour,deleteTour,addTour };
