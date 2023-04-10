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
          dateofleaving: parseInt(joinyear) + 4,
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

/**
 * @swagger
 * /faculty/myprofile:
 *  get:
 *    description: Get faculty profile
 *    parameters:
 *    - name: authorization
 *      description: authorization token
 *      required: true
 *      in: header
 *      type: string
 *    responses:
 *      200:
 *        description: Faculty profile
 *      400:
 *        description: Error getting faculty profile
 *      500:
 *        description: Error getting faculty profile
 *
 */

router.get('/myprofile', deserializeUser, isFaculty, async (req, res) => {
  log.info('GET /faculty/myprofile');
  try {
    const faculty = await Faculty.findById(req.user._id).select('-password');
    if (!faculty) {
      return res.status(400).json({
        message: 'Faculty not found',
      });
    }
    return res.status(200).json({
      message: 'Faculty profile',
      faculty,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: 'Error getting faculty profile',
    });
  }
});

/**
 * @swagger
 * /faculty/profile/student/{id}:
 *  get:
 *    description: Get student profile
 *    parameters:
 *    - name: authorization
 *      description: authorization token
 *      required: true
 *      in: header
 *      type: string
 *    - name: id
 *      description: student id
 *      required: true
 *      in: path
 *      type: string
 *    responses:
 *      200:
 *        description: Student profile
 *      400:
 *        description: Error getting student profile
 *      500:
 *        description: Error getting student profile
 *      404:
 *        description: Student not found
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */

router.get(
  '/profile/student/:id',
  deserializeUser,
  isFaculty,
  async (req, res) => {
    log.info('GET /faculty/profile/student/:id');
    try {
      const student = await Students.findById(req.params.id).select(
        '-password'
      );
      if (!student) {
        return res.status(404).json({
          message: 'Student not found',
        });
      }
      return res.status(200).json({
        message: 'Student profile',
        student,
      });
    } catch (err) {
      log.error(err);
      return res.status(500).json({
        message: 'Error getting student profile',
      });
    }
  }
);

/**
 * @swagger
 * /faculty/markattendance:
 *  post:
 *    description: Mark attendance of a class
 *    parameters:
 *    - name: authorization
 *      description: authorization token
 *      required: true
 *      in: header
 *      type: string
 *    - name: dateofleaving
 *      description: date of leaving
 *      required: true
 *      in: formData
 *      type: string
 *    - name: department
 *      description: department
 *      required: true
 *      in: formData
 *      type: string
 *    responses:
 *      200:
 *        description: Attendance marked successfully
 *      400:
 *        description: Error marking attendance
 *      500:
 *        description: Error marking attendance
 *      404:
 *        description: Student not found
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */

router.post('/markattendance', deserializeUser, isFaculty, async (req, res) => {
  log.info('POST /faculty/markattendance');
  try {
    const faculty = await Faculty.findById(req.user._id);
    if (!faculty) {
      return res.status(400).json({
        message: 'Faculty not found',
      });
    }
    const { dateofleaving, department } = req.body;
    const PRESENT_STUDENT_PRNS = [
      '120A3043',
      '120A3044',
      '120A3045',
      '120A3046',
    ];
    const students = await Students.find({
      dateofleaving: dateofleaving,
      department: department,
    }).sort({ prn: 1 });
    if (!students) {
      return res.status(404).json({
        message: 'Students not found',
      });
    }
    const attendance = [];
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const isPresent = PRESENT_STUDENT_PRNS.includes(student.prn);
      const attendanceObj = {
        student: student._id,
        date: new Date(),
        isPresent: isPresent,
        prn: student.prn,
        name: student.name,
      };
      attendance.push(attendanceObj);
    }
    console.log(attendance);
    // await Attendance.insertMany(attendance);
    return res.status(200).json({
      message: 'Attendance marked successfully',
      attendance,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: 'Error marking attendance',
    });
  }
});

module.exports = router;
