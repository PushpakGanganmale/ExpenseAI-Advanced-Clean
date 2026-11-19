const {
  extractTextFromReceipt,
  autoCateggorize,
} = require('../services/ocr.service');

const scanReceipt = async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({
      message: 'No receipt file uploaded',
    });
  }

  try {
    const { extractedText, amount, title } =
      await extractTextFromReceipt(
        req.file.buffer,
        req.file.originalname
      );

    const category = autoCateggorize(extractedText);

    return res.status(200).json({
      message: 'Receipt scanned successfully',
      data: {
        title: title || 'Receipt Expense',
        amount: amount ?? 0,
        category,
        extractedText,
      },
    });
  } catch (error) {
    console.error('Receipt OCR failed:', error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { scanReceipt };
