const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { protect } = require('../middleware/auth.middleware');
const { scanReceipt } = require('../controllers/ocr.controller');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG and PDF files are allowed'));
    }
  },
});

router.post('/scan', protect, upload.single('receipt'), scanReceipt);

module.exports = router;
