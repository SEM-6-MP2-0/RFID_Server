const jwt = require('jsonwebtoken');
const { getEnv } = require('./dotenv.utils');
const log = require('../log/index');
const createAccessToken = (user) => {
  return jwt.sign({ user }, getEnv('ACCESS_TOKEN_SECRET'), {
    expiresIn: getEnv('ACCESS_TOKEN_LIFETIME'),
  });
};
const decodeAccessToken = (token) => {
  log.info(token);
  return jwt.verify(token, getEnv('ACCESS_TOKEN_SECRET'));
};
module.exports = { createAccessToken, decodeAccessToken };
