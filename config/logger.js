const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  transports: [
    // Console logging
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // MongoDB logging
    new winston.transports.MongoDB({
      level: 'info',
      db: process.env.MONGODB_URI,
      options: { useUnifiedTopology: true },
      collection: 'logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

module.exports = logger; 