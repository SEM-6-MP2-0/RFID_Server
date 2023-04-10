const log = require('../log/index');
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      params: req.params,
      query: req.query,
      file: req.file,
    });
    log.info('Validating schema');
    return next();
  } catch (err) {
    log.error(err);
    return res.status(409).json({
      message: err.message,
    });
  }
};
module.exports = validate;
