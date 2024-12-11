module.exports = {
  apps: [{
    name: 'speaksage',
    script: 'gunicorn',
    args: 'app:app -b 0.0.0.0:5001 -w 4',
    interpreter: './venv/bin/python',
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY
    },
    output: './logs/out.log',
    error: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
}
