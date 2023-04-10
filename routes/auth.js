const express = require('express');
const log = require('../log');
const Faculty = require('../models/faculty');
const validate = require('../middleware/validateRequest');
const { SignupSchema, LoginSchema } = require('../schema/auth.schema');
const Students = require('../models/students');
const router = express.Router();

/**
 * @swagger
 * /auth/faculty/signup:
 *  post:
 *    description: Use to request a new faculty
 *    parameters:
 *    - name: name
 *      description: Faculty name
 *      in: formData
 *      required: true
 *      type: string
 *    - name: email
 *      description: Faculty email
 *      in: formData
 *      required: true
 *      type: string
 *    - name: password
 *      description: Faculty password
 *      in: formData
 *      required: true
 *      type: string
 *    - name: department
 *      description: Faculty department
 *      in: formData
 *      required: true
 *      type: string
 *    - name: isHod
 *      description: Faculty isHod
 *      in: formData
 *      required: true
 *      type: boolean
 *    - name: isClassIncharge
 *      description: Faculty isClassIncharge
 *      in: formData
 *      required: true
 *      type: boolean
 *    - name: phone
 *      description: Faculty phone
 *      in: formData
 *      required: true
 *      type: string
 *    responses:
 *      200:
 *        description: Faculty successfully signed up
 *      400:
 *        description: Faculty already exists
 *      500:
 *        description: Internal server error
 */
router.post('/faculty/signup', validate(SignupSchema), async (req, res) => {
  try {
    log.info('POST /auth/faculty/signup');
    const faculty = new Faculty(req.body);
    await faculty.save();
    return res.status(200).send({ message: 'Faculty successfully signed up' });
  } catch (e) {
    log.error(e);
    if (e.code === 11000) {
      return res.status(400).send({ message: 'Faculty already exists' });
    }
    return res.status(500).send({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/login:
 *  post:
 *    description: Use to login student or faculty
 *    parameters:
 *    - name: email
 *      description: Student or faculty email
 *      in: formData
 *      required: true
 *      type: string
 *    - name: password
 *      description: Student or faculty password
 *      in: formData
 *      required: true
 *      type: string
 *    responses:
 *      200:
 *        description: Student or faculty successfully logged in
 *      400:
 *        description: Invalid credentials
 *      500:
 *        description: Internal server error
 */

router.post('/login', validate(LoginSchema), async (req, res) => {
  try {
    log.info('POST /auth/login');

    const { email, password } = req.body;
    const checkIfExsist = await Faculty.findOne({
      $and: [{ email: email }, { isValid: true }],
    });
    if (checkIfExsist) {
      const isMatch = await checkIfExsist.comparePassword(password);
      if (isMatch) {
        const token = await checkIfExsist.generateAuthToken();
        return res.status(200).json({
          message: 'Login Successful',
          status: true,
          token: token,
        });
      } else {
        return res.status(401).json({
          message: 'Password not match',
          status: false,
        });
      }
    } else {
      const isStudentsExsist = await Students.findOne({
        $and: [{ email: email }],
      });
      if (isStudentsExsist) {
        const isMatch = await isStudentsExsist.comparePassword(password);
        if (isMatch) {
          const token = await isStudentsExsist.generateAuthToken();
          return res.status(200).json({
            message: 'Login Successful',
            status: true,
            token: token,
          });
        }
        return res.status(401).json({
          message: 'Password not match',
          status: false,
        });
      } else {
        return res.status(401).json({
          message: 'Email not registered',
          status: false,
        });
      }
    }
  } catch (err) {
    console.log('-->> User Error ', err);
    return res.status(500).json({
      message: 'Error retrieving User',
    });
  }
});

module.exports = router;
