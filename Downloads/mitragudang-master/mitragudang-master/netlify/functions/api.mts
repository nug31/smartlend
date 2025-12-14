import serverless from 'serverless-http';
import { createRequire } from 'module';

// Create require to import CommonJS module (server/index.js)
const require = createRequire(import.meta.url);
const app = require('../../server/index.js');

export const handler = serverless(app);
