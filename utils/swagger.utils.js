const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'RFID Attendance API',
      version: '1.0.0',
      description: 'RFID Attendance API',
      contact: {
        name: 'Salman Adhikari',
        email: 'salmanad5s3@gmail.com',
      },
    },
  },
  apis: ['./routes/*.js', './model/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const setup = swaggerUI.setup(swaggerDocs);
const serve = swaggerUI.serve;
module.exports = {
  serve,
  setup,
};
