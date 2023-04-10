const express = require('express');
const deserializeUser = require('../middleware/deserializeUser');
const { isStudents } = require('../middleware/roles');
const Students = require('../models/students');
const log = require('../log');
const router = express.Router();

/**
 * @swagger
 * /students/myprofile:
 *  get:
 *    description: get students myprofile
 *    parameters:
 *    - name: Authorization
 *      in: header
 *      description: Bearer token
 *      required: true
 *      type: string
 *    responses:
 *      200:
 *       description: profile retrieved successfully
 *      500:
 *        description: Error retrieving profile
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: profile not found
 */

router.get('/myprofile', deserializeUser, isStudents, async (req, res) => {
  log.info('GET /students/myprofile');
  try {
    const student = await Students.findById(req.user._id).select('-password');
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
});

module.exports = router;
