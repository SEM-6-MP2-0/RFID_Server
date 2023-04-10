const mongoose = require('mongoose');
const { getEnv } = require('../utils/dotenv.utils');
const log = require('../log/index');

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(getEnv('MONGODB_URI'));
    log.info(`MongoDB Connected: ${connect.connection.host}`);
  } catch (err) {
    log.error(err);
  }
};

module.exports = connectDb;
