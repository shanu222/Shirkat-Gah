/**
 * PM2 Ecosystem — Shirkat Gah Production (AWS EC2)
 *
 * Run from repository root:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save && pm2 startup
 */
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const LOG_DIR = process.env.PM2_LOG_DIR || path.join(ROOT, 'logs');

/** Load key=value pairs from .env.production for PM2 process env */
function loadEnvFile(filename) {
  const filePath = path.join(ROOT, filename);
  if (!fs.existsSync(filePath)) return {};

  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const productionEnv = {
  ...loadEnvFile('.env.production'),
  NODE_ENV: 'production',
  API_PORT: '3001',
  PORT: '3001',
  API_HOST: '0.0.0.0',
};

module.exports = {
  apps: [
    {
      name: 'shirkat-gah-api',
      cwd: ROOT,
      script: 'apps/api/dist/main.js',
      instances: process.env.PM2_INSTANCES || 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      kill_timeout: 10000,
      listen_timeout: 15000,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: path.join(LOG_DIR, 'api-error.log'),
      out_file: path.join(LOG_DIR, 'api-out.log'),
      env: {
        NODE_ENV: 'development',
        API_PORT: '4000',
        PORT: '4000',
        API_HOST: '0.0.0.0',
      },
      env_staging: {
        ...loadEnvFile('.env.staging'),
        NODE_ENV: 'staging',
        API_PORT: '3001',
        PORT: '3001',
        API_HOST: '0.0.0.0',
      },
      env_production: productionEnv,
    },
  ],
};
