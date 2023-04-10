const express = require('express');
const log = require('../log');
const Faculty = require('../models/faculty');
const deserializeUser = require('../middleware/deserializeUser');
const { isFaculty } = require('../middleware/roles');
const Students = require('../models/students');
const upload = require('../utils/multer.utils');
const router = express.Router();
const excel = require('exceljs');
const { encryptPassword } = require('../utils/bcrypt.utils');

/**
 * @swagger
 * /faculty/insertrolllist:
 *  post:
 *    description: Insert roll list of a class wich contains roll number name and email and date of joining
 *    parameters:
 *    - name: authorization
 *      description: authorization token
 *      required: true
 *      in: header
 *      type: string
 *    - name: Rollfile
 *      description: file containing roll list of a class
 *      required: true
 *      in: formData
 *      type: file
 *    - name: joinyear
 *      description: year of joining
 *      required: true
 *      in: formData
 *      type: string
 *    - name: department
 *      description: department of the class
 *      required: true
 *      in: formData
 *      type: string
 *    responses:
 *      200:
 *        description: Roll list inserted successfully
 *      400:
 *        description: Error inserting roll list
 *      500:
 *        description: Error inserting roll list
 */

router.post(
  '/insertrolllist',
  upload.single('Rollfile'),
  deserializeUser,
  isFaculty,
  async (req, res) => {
    log.info('POST /classincharge/insertrolllist');
    try {
      const faculty = await Faculty.findById(req.user._id);
      if (!faculty) {
        return res.status(400).json({
          message: 'Faculty not found',
        });
      }
      const { joinyear, department } = req.body;
      const file = req.file;
      // // insert excel data to db
      const workbook = new excel.Workbook();
      const worksheet = await workbook.xlsx.readFile(
        'uploads/' + file.originalname
      );
      const sheet = worksheet.getWorksheet(1);
      const rollList = [];
      for (let i = 3; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        if (
          !row.getCell(3).value ||
          !row.getCell(2).value ||
          !row.getCell(5).value ||
          !row.getCell(4).value
        ) {
          console.log('Invalid row', row.getCell(3).value || '');
          continue;
        }
        const student = {
          name: row.getCell(3).value,
          prn: row.getCell(2).value,
          email: row.getCell(5).value?.['text'] || row.getCell(5).value || '',
          dateofjoining: joinyear,
          department: department,
          password: await encryptPassword('Pass@123'),
        };
        rollList.push(student);
      }
      await Students.insertMany(rollList);
      return res.status(200).json({
        message: 'Roll list uploaded successfully',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Error inserting roll list',
      });
    }
  }
);

module.exports = router;
