const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { createWorker } = require('tesseract.js');

let workerPromise = null;

const getWorker = async () => {
  if (!workerPromise) {
    workerPromise = createWorker('eng').catch((error) => {
      workerPromise = null;
      throw error;
    });
  }

  return workerPromise;
};

const extractAmount = (text) => {
  const patterns = [
    /(?:grand\s*total|total\s*amount|amount\s*paid|total|amount|subtotal)\s*[:\-]?\s*(?:INR|RS\.?|₹|\$)?\s*(\d[\d,]*(?:\.\d{1,2})?)/i,
    /(?:INR|RS\.?|₹|\$)\s*(\d[\d,]*(?:\.\d{1,2})?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      const amount = Number(match[1].replace(/,/g, ''));

      if (Number.isFinite(amount)) {
        return amount;
      }
    }
  }

  return null;
};

const extractTitle = (text) => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines[0] || 'Receipt Expense';
};

const autoCateggorize = (text) => {
  const lowerText = text.toLowerCase();

  if (/restaurant|food|cafe|pizza|burger|lunch|dinner|breakfast/.test(lowerText)) return 'food';

  if (/uber|ola|taxi|metro|bus|petrol|fuel|transport/.test(lowerText)) return 'transport';

  if (/amazon|flipkart|shopping|mall|store|retail/.test(lowerText)) return 'shopping';

  if (/hospital|pharmacy|medical|doctor|health|clinic/.test(lowerText)) return 'health';

  if (/movie|netflix|spotify|entertainment|game/.test(lowerText)) return 'entertainment';

  if (/electricity|water|gas|internet|utility|bill/.test(lowerText)) return 'utilities';

  return 'other';
};

const extractTextFromReceipt = async (imagePath) => {
  try {
    if (!imagePath || !fs.existsSync(imagePath)) {
      throw new Error('Receipt file not found');
    }

    const buffer = fs.readFileSync(imagePath);
    const extension = path.extname(imagePath).toLowerCase();

    let extractedText = '';

    if (extension === '.pdf') {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || '';

      if (!extractedText.trim()) {
        throw new Error(
          'This PDF contains no extractable text. Scanned PDFs require PDF-to-image conversion before OCR.'
        );
      }
    } else if (['.jpg', '.jpeg', '.png'].includes(extension)) {
      const worker = await getWorker();
      const result = await worker.recognize(buffer);
      extractedText = result.data.text || '';
    } else {
      throw new Error('Unsupported receipt format');
    }

    if (!extractedText.trim()) {
      throw new Error('No text could be extracted from the receipt');
    }

    return {
      extractedText,
      amount: extractAmount(extractedText),
      title: extractTitle(extractedText),
    };
  } catch (error) {
    throw new Error('OCR processing failed: ' + error.message);
  }
};

module.exports = {
  extractTextFromReceipt,
  autoCateggorize,
};
