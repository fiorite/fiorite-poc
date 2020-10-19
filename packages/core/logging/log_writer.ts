import { LogLevel } from './log_level';

export type LogWriter = (state: unknown, level?: LogLevel | number) => void;
