import { LogLevel, Diag } from "@activescott/diag"
import DiagWinstonImp from "./DiagWinstonImp"

/**
 * Creates a Diag instance that logs to winston.
 * @param loggerName The name of this logger.
 * @param level The level that this logger should log messages for.
 * @param logFilename A filename to log to the specified file or null to not log to a file.
 * @param includeConsoleLogger True to log to the global Console.
 * @param meta Any additional metadata to include in each log entry. For example on a server maybe a the hostname (e.g. `{ hostname: os.hostname() }`).
 */
export function createLogger(
  loggerName: string,
  level: LogLevel = LogLevel.WARN,
  logFilename?: string,
  includeConsoleLogger?: boolean,
  meta?: Record<string, string>
): Diag {
  // attempting to be isomorphic here to support SSR
  if (!logFilename) logFilename = process.browser ? null : "diag-log.log"
  if (includeConsoleLogger === null)
    includeConsoleLogger = Boolean(process.browser)
  return DiagWinstonImp.create(
    loggerName,
    level,
    logFilename,
    includeConsoleLogger,
    meta
  )
}
