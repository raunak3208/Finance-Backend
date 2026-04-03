const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'Backend API for managing financial records with role-based access',
    },
    servers: [
      { url: 'http://localhost:5001', description: 'Local server' },
    ],
    components: {
      securitySchemes: {
        // Tells Swagger how to send JWT token
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }], 
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);