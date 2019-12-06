const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDefinition = {
  swagger: "2.0",
  info: {
    title: "Knext API",
    description: "Knext's awesome API Explorer",
    version: "1.0.0"
  },
  host: "127.0.0.1:3000",
  basePath: "/api/v1",
  schemes: ["http", "https"]
};

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ["./**/*.yaml"]
});

module.exports = swaggerSpec;
