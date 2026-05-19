/**
 * PM2 Ecosystem — Shirkat Gah Production (AWS EC2)
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save
 *   pm2 startup
 */
module.exports = {
  apps: [
    {
      name: 'shirkat-gah-api',
      cwd: './apps/api',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      kill_timeout: 5000,
      listen_timeout: 10000,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/shirkat-gah/api-error.log',
      out_file: '/var/log/shirkat-gah/api-out.log',
      env: {
        NODE_ENV: 'development',
        API_PORT: 4000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        API_PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        API_PORT: 3001,
      },
    },
  ],
};
