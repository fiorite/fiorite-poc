import { getIterator } from '@fiorite/core';

import { Segment } from './segment';
import { StaticSegment } from './segments/static';
import { SegmentParser } from './segment_parser';

export class SegmentCollection implements Iterable<Segment> {
  private buffer: Segment[] = [];

  constructor(readonly parser = SegmentParser.default) { }

  add(segment: Segment): this {
    this.buffer.push(segment);
    return this;
  }

  addStatic(value: string): this {
    return this.add(
      new StaticSegment(value),
    );
  }

  addDynamic(expression: string): this {
    return this.add(
      this.parser.parse(expression),
    );
  }

  [Symbol.iterator](): Iterator<Segment> {
    return getIterator(this.buffer);
  }
}
