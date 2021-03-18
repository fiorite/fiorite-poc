import { Segment } from '../segment';
import { createSegmentMatch, SegmentMatch } from '../segment_match';

/**
 * Source: https://tools.ietf.org/html/rfc3986#section-3
 *
 * reserved    = gen-delims / sub-delims
 * gen-delims  = ":" / "/" / "?" / "#" / "[" / "]" / "@"
 * sub-delims  = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
 * unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
 * HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
 * pct-encoded = "%" HEXDIG HEXDIG
 * pchar = unreserved / pct-encoded / sub-delims / ":" / "@"
 *
 * pattern = [a-z0-9-._~(%[A-F\d]{2})!$&'()*+,;=:@]+
 */
const gen_delims = '[:\\/?#[]@]';
const sub_delims = '[!$&\'()*+,;=]';
const unreserved = '[a-zA-Z0-9-._~]';
const HEXDIG = '[A-F0-9]';
const pct_encoded = `%${HEXDIG}{2}`;
const pchar = `(${unreserved}|${pct_encoded}|${sub_delims}|[:@])`;

// const default_pattern = '([a-zA-Z0-9-._~]|%[A-F0-9]{2}|[!$&\'()*+,;=]|[:@])+';
const default_pattern = `${pchar}+`;
const wildcard_pattern = '.+';

export class DynamicSegment implements Segment {
  readonly matcher: RegExp;

  static default(key: string) {
    return new DynamicSegment(key, default_pattern);
  }

  static wildcard(key: string) {
    return new DynamicSegment(key, wildcard_pattern);
  }

  /**
   *
   * @param key
   * @param pattern configurable pattern for regexp. Should be without start of string '^'.
   */
  constructor(readonly key: string, readonly pattern = default_pattern) {
    this.matcher = new RegExp('^' + pattern);
  }

  /**
   * @inheritDoc
   */
  match(path: string): SegmentMatch {
    const matches = path.match(this.matcher);

    if (null === matches) {
      return createSegmentMatch(false);
    }

    const [match] = matches;

    return createSegmentMatch(true, match.length, {
      [this.key]: match,
    });
  }

  /**
   * @inheritDoc
   */
  [Symbol.equals](other: unknown): boolean {
    return other instanceof DynamicSegment &&
      other.pattern === this.pattern;
  }
}
