const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log('filename', file, req.files);
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    console.log('filename', file, req.files);
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  // reject a file
  console.log('file rej', file, req.files);
  if (
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});
module.exports = upload;
