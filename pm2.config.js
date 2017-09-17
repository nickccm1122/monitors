'use strict'

const pkg = require('./package')

module.exports = {
  apps: [
    {
      name: pkg.name,
      script: 'yarn',
      args: 'start',
      merge_logs: true,
      restart_delay: 5000,
      env: {
        watch: false,
        autorestart: true
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['monitors'],
      path: `/srv/${pkg.name}`,
      ref: 'origin/master',
      repo: 'git@github.com:nickccm1122/monitors.git',
      'post-deploy': '. \\~/.zshrc\\; node --version && which npm',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}
