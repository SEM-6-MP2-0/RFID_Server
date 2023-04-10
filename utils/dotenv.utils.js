require('dotenv').config();

const getEnv = (key) => {
  return process.env[key];
};
const getEnvInt = (key) => {
  return parseInt(getEnv(key));
};

module.exports = { getEnv, getEnvInt };
