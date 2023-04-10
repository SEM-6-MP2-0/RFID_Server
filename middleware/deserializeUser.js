const { decodeAccessToken } = require('../utils/jwt.utils');
const log = require('../log/index');

const deserializeUser = async (req, res, next) => {
  try {
    log.info('Deserializing user');
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      log.info(token);
      const user = decodeAccessToken(token);

      req.user = user.user;
      next();
    } else {
      return res.status(401).send('Unauthorized');
    }
  } catch (err) {
    log.error(err);
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

module.exports = deserializeUser;
