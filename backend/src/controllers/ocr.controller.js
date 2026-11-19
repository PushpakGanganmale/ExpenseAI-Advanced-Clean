const { extractTextFromReceipt, autoCateggorize } = require('../services/ocr.service');
const fs = require('fs');

const scanReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imagePath = req.file.path;

  try {
    const { extractedText, amount, title } =
      await extractTextFromReceipt(imagePath);

    const category = autoCateggorize(extractedText);

    return res.status(200).json({
      message: 'Receipt scanned successfully',
      data: {
        title: title || 'Receipt Expense',
        amount: amount || 0,
        category,
        extractedText,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  } finally {
    try {
      await fs.promises.unlink(imagePath);
    } catch (cleanupError) {
      if (cleanupError.code !== 'ENOENT') {
        console.error('Receipt file cleanup failed:', cleanupError.message);
      }
    }
  }
};

module.exports = { scanReceipt };
