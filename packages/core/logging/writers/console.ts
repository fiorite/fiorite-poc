import { Callable } from '../../callable';
import { LogWriter } from '../log_writer';

export class ConsoleWriter extends Callable<LogWriter> {
  static readonly default = new ConsoleWriter(console);

  constructor(console: Console) {
    super((state: unknown, level?: number) => {
      // Add levels
      switch (level) {
        default:
          console.log(state);
          break;
      }
    });
  }
}

