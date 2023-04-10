const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /students/profile:
 *  get:
 *    description: get students profile
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

router.get('/profile', (req, res) => {
  res.send('Hello World');
});

module.exports = router;
