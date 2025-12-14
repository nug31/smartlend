// Use standard require/exports for Netlify Functions (Node.js runtime)
const serverless = require('serverless-http');
const app = require('../../server/index.js');

module.exports.handler = serverless(app);
