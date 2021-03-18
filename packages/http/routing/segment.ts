import { Equatable } from '@fiorite/core';

import { SegmentMatch } from './segment_match';

/**
 * Represents particular segment of a path.
 */
export interface Segment extends Equatable {
  /**
   * Returns length of matched segment.
   *
   * @param path
   */
  match(path: string): SegmentMatch;
}
