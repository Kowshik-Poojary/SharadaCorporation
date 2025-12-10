import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  preservePath: true,
  limits: {
    fieldSize: 10 * 1024 * 1024,   // allow large nested field text
    fileSize: 20 * 1024 * 1024,
    fields: 2000,                 // allow many fields like nested variants
  }
});

export default upload;
