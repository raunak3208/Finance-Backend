const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware'); 
const { recordRules, updateRecordRules } = require('../middleware/validationRules'); // validation rules
const validate = require('../middleware/validate'); // validate result


const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getDeletedRecords,
  restoreDeletedRecord,
} = require('../controllers/recordController');
const { exportRecords } = require('../controllers/exportController');

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a financial record
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 example: salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-01"
 *               note:
 *                 type: string
 *                 example: March salary credit
 *     responses:
 *       201:
 *         description: Record created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not authorized
 */

// create record (analyst, admin)
router.post('/', protect, allowRoles('analyst','admin'), recordRules, validate, createRecord);


/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all records with optional filters and pagination
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of records with pagination info
 */

// get all records
router.get('/', protect, getRecords);

router.get('/export', protect, exportRecords);

// get deleted records (admin only)
router.get('/deleted', protect, allowRoles('admin'), getDeletedRecords);

// get single record
router.get('/:id', protect, getRecordById);

// update record
router.put('/:id', protect, updateRecordRules, validate, updateRecord);

// soft delete record
router.delete('/:id', protect, deleteRecord);

// restore record (admin only)
router.patch('/:id/restore', protect, allowRoles('admin'), restoreDeletedRecord);



module.exports = router;