export enum LogLevel {
  None,
  Error,
  Warning,
  Info,
  Verbose,
  Debug,
}

export class Logger {
  constructor(
    public level = LogLevel.Debug,
  ) {
  }

  log(level: LogLevel, message: string): void {
    if (this.level < level) {
      return;
    }

    console.log(message);
  }

  error(message: string): void {
    return this.log(LogLevel.Error, 'ERROR: ' + message);
  }

  warn(message: string): void {
    return this.log(LogLevel.Warning, 'WARN: ' + message);
  }

  info(message: string): void {
    return this.log(LogLevel.Info, 'INFO: ' + message);
  }

  verbose(message: string): void {
    return this.log(LogLevel.Verbose, 'VERBOSE: ' + message);
  }

  debug(message: string): void {
    return this.log(LogLevel.Debug, 'DEBUG: ' + message);
  }
}

export const defaultLogger = new Logger();
