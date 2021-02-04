module.exports = {
  apps: [
    {
      name: 'Video-CMS-Telegram',
      script: 'server.js',
      env: {
        NODE_ENV: 'emphy',
        PORT: 8443,
        BOT_NAME: 'vcmsbot',
        DOMEN: 'tele.pepex.kg'
      },
      env_local: {
        NODE_ENV: 'local',
        PORT: 8443,
        BOT_NAME: 'vcmstestbot',
        DOMEN: 'botkg.ga'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8443,
        BOT_NAME: 'vcmsbot',
        DOMEN: 'tele.pepex.kg'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 8443,
        BOT_NAME: 'vcmsbot',
        DOMEN: 'tele.pepex.kg'
      }
    }
  ],
  deploy: {
    production: {
      user: 'videocms',
      host: 'vcms.pepex.kg',
      ref: 'origin/master',
      repo: 'git@github.com:PavelKg/Video-CMS-telegram.git',
      path: '~/services/videocms-telegram',
      'post-deploy':
        'npm i && pm2 startOrRestart ecosystem.config.js --env production'
    },
    development: {
      user: 'videocms',
      host: 'vcms.pepex.kg',
      ref: 'origin/development',
      repo: 'git@github.com:PavelKg/Video-CMS-Telegram.git',
      path: '~/services/videocms-telegram',
      'post-deploy':
        'npm i &&  pm2 startOrRestart ecosystem.config.js --env development'
    }
  }
}
