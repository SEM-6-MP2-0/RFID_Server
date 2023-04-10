const { serve, setup } = require('../utils/swagger.utils');

const initRoutes = (app) => {
  app.use('/api-docs', serve, setup);
  app.use('/auth', require('./auth'));
  app.use('/students', require('./students'));
  app.use('/faculty', require('./faculty'));
};

module.exports = initRoutes;
