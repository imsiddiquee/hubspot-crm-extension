const path = require("path");
const winston = require("winston");
const expressWinston = require("express-winston");
const winstonDailyRotateFile = require("winston-daily-rotate-file");
const winstonMongodb = require("winston-mongodb");
const winstonElasticsearch = require("winston-elasticsearch");

const { DB_URI } = require("../../5-utils/util");

module.exports = (app, message, dirname) => {
  let filename = path.join(dirname, "/6-public/log/" + "log-error-%DATE%.log");
  const mongoErrorTransport = new winston.transports.MongoDB({
    db: process.env.MONGODB_URI || DB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    metakey: "meta",
  });

  const fileErrorTransport = new winston.transports.DailyRotateFile({
    filename: filename,
    datePattern: "yyyy-MM-DD-HH",
  });

  const infoLogger = expressWinston.errorLogger({
    transports: [
      new winston.transports.Console(),
      fileErrorTransport,
      mongoErrorTransport,
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: message,
  });

  app.use(infoLogger);
};
