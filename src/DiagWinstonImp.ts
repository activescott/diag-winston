import { Diag, LogLevel, logLevelString } from "@activescott/diag"
import winston from "winston"
export { LogLevel } from "@activescott/diag"

export default class DiagWinstonImp extends Diag {
  private readonly logger: winston.Logger

  /**
   * Creates a Diag instance that logs to the specified winston instance.
   * @param loggerName The name of this logger.
   * @param level The level that this logger should log messages for.
   * @param logFilename A filename to log to the specified file or null to not log to a file.
   * @param includeConsoleLogger True to log to the global Console.
   * @param meta Any additional metadata to include in each log entry. For example on a server maybe a the hostname (e.g. `{ hostname: os.hostname() }`).
   */
  private constructor(
    name: string,
    level: LogLevel = LogLevel.INFO,
    winstonLogger: winston.Logger
  ) {
    super(name, level)
    this.logger = winstonLogger
  }

  /**
   * Creates a Diag instance that logs to winston.
   * @param loggerName The name of this logger.
   * @param level The level that this logger should log messages for.
   * @param logFilename A filename to log to the specified file or null to not log to a file.
   * @param includeConsoleLogger True to log to the global Console.
   * @param meta Any additional metadata to include in each log entry. For example on a server maybe a the hostname (e.g. `{ hostname: os.hostname() }`).
   */
  public static create(
    loggerName: string,
    level: LogLevel,
    logFilename: string | null,
    includeConsoleLogger: boolean,
    meta?: Record<string, string>
  ): DiagWinstonImp {
    const winston = createWinston(
      loggerName,
      level,
      logFilename,
      includeConsoleLogger,
      meta
    )
    return new DiagWinstonImp(loggerName, level, winston)
  }

  public createChild(name: string): Diag {
    return new DiagWinstonImp(
      this.name + "." + name,
      this.level,
      this.logger.child({})
    )
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  protected logImp(
    level: LogLevel,
    message: string,
    ...optionalParams: any[]
  ): void {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    this.logger.log(logLevelString(level), message, optionalParams)
  }
}

function createWinston(
  loggerName: string,
  level: LogLevel,
  logFilename: string | null,
  includeConsoleLogger: boolean,
  meta?: Record<string, string>
): winston.Logger {
  const logger: winston.Logger = winston.createLogger({
    level: logLevelString(level),
    defaultMeta: {
      loggerName,
      ...(meta || {}),
    },
  })

  if (logFilename && typeof logFilename === "string") {
    logger.add(
      new winston.transports.File({
        filename: logFilename,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.splat(),
          winston.format.json()
        ),
      })
    )
  }

  if (includeConsoleLogger) {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.splat(),
          winston.format.simple()
        ),
      })
    )
  }
  return logger
}
