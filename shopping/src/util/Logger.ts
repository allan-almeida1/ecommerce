import winston from "winston";

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  }

  /**
   * Generic log method
   * @param level Level (e.g. info, warn, error)
   * @param message Message to log
   */
  public log(level: string, message: string): void {
    this.logger.log(level, message);
  }

  /**
   * Log on info level
   * @param message Message to log
   */
  public info(message: string): void {
    this.logger.info(message);
  }

  /**
   * Log on error level
   * @param message Message to log
   */
  public error(message: string): void {
    this.logger.error(message);
  }
}

export default new Logger();
