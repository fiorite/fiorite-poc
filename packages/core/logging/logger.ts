import { Callable } from '../callable';
import { LogLevel } from './log_level';
import { LogWriter } from './log_writer';
import { ConsoleWriter } from './writers/console';

export class Logger extends Callable<LogWriter> {
  static readonly null = new Logger(() => void 0);
  static readonly console = new Logger(ConsoleWriter.default);

  constructor(readonly writer: LogWriter) {
    super(writer);
  }

  debug(state: unknown) {
    this.writer(state, LogLevel.Debug);
  }

  warning(state: unknown) {
    this.writer(state, LogLevel.Debug);
  }

  error(state: unknown) {
    this.writer(state, LogLevel.Error);
  }
}

/**
 * @deprecated Use specific instance of {@link Logger}.
 */
export const logger = Logger.console;
