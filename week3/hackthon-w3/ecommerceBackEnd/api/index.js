const serverless = require("serverless-http");
const app = require("../app"); // This points to your Express app

module.exports = serverless(app);
