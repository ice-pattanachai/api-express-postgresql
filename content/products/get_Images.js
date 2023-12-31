const db = require('../../database/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './images',
  filename: function (req, file, cb) {
    const originalFileName = file.originalname;
    const time = Date.now().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    cb(null, originalFileName , time);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
}).single('image');

const getImages = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      const fileName = req.file.filename;
      const images_weapon = req.file.path;
      const fileExtension = path.extname(req.file.originalname);
      // const images_weapon = `${fileName}${fileExtension}`;
      const time = new Date()

      const sql = 'INSERT INTO images_weapon (fileName, images_weapon, time) VALUES (?, ?, ?)';
      db.connection.query(sql, [fileName, images_weapon, time], (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          console.log('Image uploaded successfully');
          res.sendStatus(200);
        }
      });
    }
  });
};

module.exports = { getImages };