import { Normalizer } from '@fiorite/core';

/**
 * TODO: Add date formats.
 */
export class DateNormalizer implements Normalizer<Date, string> {
  static readonly default = new DateNormalizer();

  normalize(value: Date): string {
    return value.toISOString();
  }
}
