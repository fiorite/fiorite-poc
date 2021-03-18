import { Segment } from '../segment';
import { createSegmentMatch, SegmentMatch } from '../segment_match';

export class StaticSegment implements Segment {
  constructor(readonly value: string) { }

  /**
   * @inheritDoc
   */
  match(path: string): SegmentMatch {
    if (path.length < this.value.length || !path.startsWith(this.value)) {
      return createSegmentMatch(false);
    }

    return createSegmentMatch(true, this.value.length);
  }

  /**
   * @inheritDoc
   */
  [Symbol.equals](other: unknown): boolean {
    return other instanceof StaticSegment &&
      other.valueOf() === this.valueOf();
  }
}
