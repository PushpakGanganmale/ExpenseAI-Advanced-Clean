
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { protect } = require('../middleware/auth.middleware');
const { scanReceipt } = require('../controllers/ocr.controller');

const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
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
