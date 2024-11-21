//@ts-check
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

async function healthCheckController(req, res) {
  logger.info("healthCheckController  | GET");
  try {
    res.status(200).json({ status: "OK" });
  } catch (error) {
    logger.error("healthCheckController   | ERROR", error);
    res.status(400);
  }
}

module.exports = {
  healthCheckController,
};
