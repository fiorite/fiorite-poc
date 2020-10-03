import { isObject } from '../util';
import { Equatable } from '../equality';

export interface DurationParts {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
}

function numberOrZero(value?: number) {
  return typeof value === 'number' ? value : 0;
}

export function sumDurationParts(parts: DurationParts) {
  return [
    numberOrZero(parts.microseconds) * Duration.microsecond,
    numberOrZero(parts.milliseconds) * Duration.millisecond,
    numberOrZero(parts.seconds) * Duration.second,
    numberOrZero(parts.minutes) * Duration.minute,
    numberOrZero(parts.hours) * Duration.hour,
    numberOrZero(parts.days) * Duration.day,
  ].reduce((sum, x) => sum + Math.floor(x), 0);
}

export class Duration extends Number implements Equatable {
  /**
   * Seconds per microsecond.
   */
  static readonly microsecond: 0.000001 = 0.000001;

  /**
   * Seconds per millisecond.
   */
  static readonly millisecond: 0.001 = 0.001;

  /**
   * Milliseconds per second.
   */
  static readonly second: 1 = 1;

  /**
   * Milliseconds per minute.
   */
  static readonly minute: 60 = 60;

  /**
   * Milliseconds per hour.
   */
  static readonly hour: 3600 = 3600;

  /**
   * Milliseconds per day.
   */
  static readonly day: 86400 = 86400;

  /**
   * Number of whole microseconds spanned by this {@link Duration}.
   */
  get microseconds(): number {
    return Math.floor(this.valueOf() * Duration.microsecond);
  }

  /**
   * Number of whole milliseconds spanned by this {@link Duration}.
   */
  get milliseconds(): number {
    return Math.floor(this.valueOf() * Duration.millisecond);
  }

  /**
   * Number of whole seconds spanned by this {@link Duration}.
   */
  get seconds() {
    return Math.floor(this.valueOf());
  }

  /**
   * Number of whole minutes spanned by this {@link Duration}.
   */
  get minutes() {
    return Math.floor(this.valueOf() / Duration.minute);
  }

  /**
   * Number of whole hours spanned by this {@link Duration}.
   */
  get hours() {
    return Math.floor(this.valueOf() / Duration.hour);
  }

  /**
   * Number of whole days spanned by this {@link Duration}.
   */
  get days() {
    return Math.floor(this.valueOf() / Duration.day);
  }

  get negative(): boolean {
    return this.valueOf() < 0;
  }

  constructor(milliseconds: number);
  constructor(parts: DurationParts);
  constructor(arg: number | DurationParts);
  constructor(arg: number | DurationParts) {
    let value: number;

    if (typeof arg === 'number') {
      value = arg;
    } else if (isObject(arg)) {
      value = sumDurationParts(arg);
    } else {
      throw new TypeError();
    }

    super(value);
  }

  abs(): Duration {
    return new Duration(Math.abs(this.milliseconds));
  }

  equals(other: unknown): boolean {
    return this[Symbol.equals](other);
  }

  [Symbol.equals](other: unknown): boolean {
    return other instanceof Duration &&
      other.valueOf() === this.valueOf();
  }

  // todo: compare, equals
}
