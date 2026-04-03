const {
  fetchRecordsForExport,
  formatRecords,
  convertToCSV,
} = require('../services/exportService');

const exportRecords = async (req, res, next) => {
  try {
    const format = (req.query.format || 'json').toLowerCase();

    // Validate format
    if (!['csv', 'json'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Use ?format=csv or ?format=json',
      });
    }

    // Fetch + clean records
    const raw      = await fetchRecordsForExport(req.user, req.query);
    const records  = formatRecords(raw);

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No records found to export',
      });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename  = `finance_records_${timestamp}`;

    // JSON Export
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.json"`
      );

      return res.json({
        exportedAt:   new Date().toISOString(),
        totalRecords: records.length,
        records,
      });
    }
    // export as CSV
    if (format === 'csv') {
      const csv = convertToCSV(records);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}.csv"`
      );

      return res.send(csv); 
    }

  } catch (err) { next(err); }
};

module.exports = { exportRecords };