const bcrypt = require('bcrypt');
const { getEnvInt } = require('./dotenv.utils');

const saltRounds = getEnvInt('SALT_ROUNDS');

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
const comparePassword = async (password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
module.exports = {
  encryptPassword,
  comparePassword,
};
