const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Docs",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:8000", // Works for local + deployed
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Load all route files in project
  apis: [path.join(__dirname, "../**/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
