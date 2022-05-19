require('dotenv-safe/config');
const { execSync } = require('child_process');

process.env.DB_URL = `${process.env.DB_URL}_test?schema=test`;

execSync('npm run db:migrate');

module.exports = {};
