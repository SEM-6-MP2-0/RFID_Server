const { serve, setup } = require('../utils/swagger.utils');

const initRoutes = (app) => {
  app.use('/api-docs', serve, setup);
  app.use('/students', require('./students'));
};

module.exports = initRoutes;
