const winston = require("winston");
const expressWinston = require("express-winston");
const winstonDailyRotateFile = require("winston-daily-rotate-file");
const winstonMongodb = require("winston-mongodb");
const winstonElasticsearch = require("winston-elasticsearch");
const path = require("path");

module.exports = (app, message, dirname) => {
  let filename = path.join(dirname, "/6-public/log/" + "log-info-%DATE%.log");
  const fileInfoTransport = new winston.transports.DailyRotateFile({
    filename: filename,
    datePattern: "yyyy-MM-DD-HH",
  });

  const infoLogger = expressWinston.logger({
    transports: [new winston.transports.Console(), fileInfoTransport],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: message,
  });

  app.use(infoLogger);
};
