import multer from 'multer';


/**
 * ****************************************************************************************
 *                                         Configure Multer
 * ****************************************************************************************
 */

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});



const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an Image! Please Upload only Images'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

/**
 * ****************************************************************************************
 *                                         Middlewares
 * ****************************************************************************************
 */
const uploadUserImage = upload.single('photo');



export default uploadUserImage;
