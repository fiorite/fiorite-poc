// working file

import { Selector } from '../packages/core/operators/functional_types';
import { clone } from '../packages/core/cloning';
import { logger } from '../packages/core/logging';
import { RequestHandler } from '../packages/http/request_handler';

interface Segment {
  /**
   * Dynamic segment should provide data.
   * Static and dynamic should provide path cutter.
   *
   * @param path
   */
  match(path: string): SegmentMatch;
}

interface Matchable<T> {
  match(object: T): boolean;
}

class SegmentMatch {
  constructor(
    readonly value: boolean,
    readonly offset: number = 0,
    readonly data: Record<string, unknown> = {},
  ) { }
}

class StaticPathSegment implements Segment {
  constructor(readonly value: string) { }

  match(path: string): SegmentMatch {
    if (path.length < this.value.length) {
      return new SegmentMatch(false);
    }

    if (!path.startsWith(this.value)) {
      return new SegmentMatch(false);
    }

    return new SegmentMatch(true, this.value.length);
  }
}

class DynamicPathSegment implements Segment {
  readonly matcher: RegExp;

  constructor(
    readonly key: string,
    readonly pattern: string = '[a-zA-Z0-9\-]+',
    readonly converter: Selector<string, unknown> = x => x,
  ) {
    this.matcher = new RegExp('^' + pattern);
  }

  match(path: string): SegmentMatch {
    const matches = path.match(this.matcher);

    if (null === matches || matches.length < 1) {
      return new SegmentMatch(false);
    }

    const [match] = matches;

    return new SegmentMatch(true, match.length, {
      [this.key]: this.converter(match),
    });
  }
}

class RoutePath {
  constructor(
    readonly segments: Iterable<Segment>,
    readonly handler: RequestHandler,
  ) { }

  match(path: string) {
    let data = {};

    for (const segment of this.segments) {
      const match = segment.match(path);

      if (!match.value) {
        return false;
      }

      data = { ...data, ...match.data };
      path = path.substr(match.offset, path.length);
    }

    if (path.length) {
      return false;
    }

    logger('data:' + data);

    return true;
  }
}

class SegmentCollection {
  private segments: Segment[] = [];

  private add(segment: Segment): this {
    this.segments.push(segment);

    return this;
  }

  static(value: string): this {
    const segment = new StaticPathSegment(value);
    return this.add(segment);
  }

  dynamic(value: string): this {
    const index = value.indexOf('|');

    let key = value;
    let pattern = '[a-zA-Z0-9\-]+';
    let converter: Selector<string, unknown> = x => x;

    if (index > -1) {
      key = value.slice(0, index).trim();
      const format = value.slice(index + 1, value.length).trim();

      if (false) {
        // todo: arguments
      }

      // todo: arguments like: 'range(1, 2, 3)'

      switch (format) {
        case 'alpha':
          pattern = '[a-zA-Z]+';
          break;
        case 'boolean':
          pattern = '(true|false)';
          converter = x => x.toLowerCase() === 'true';
          break;
        case 'number':
        case 'float':
          pattern = '[0-9]+(.[0-9]+|)';
          converter = x => Number(x);
          break;
        case 'int':
          pattern = '[0-9]+';
          converter = x => Number(x);
          break;
        default:
          throw new Error('Unknown format: ' + format);
      }
    }

    const segment = new DynamicPathSegment(key, pattern, converter);

    return this.add(segment);
  }

  match(path: string): boolean {
    let data = {};

    for (const segment of this.segments) {
      const match = segment.match(path);

      if (!match.value) {
        return false;
      }

      data = { ...data, ...match.data };
      path = path.substr(match.offset, path.length);
    }

    if (path.length) {
      return false;
    }

    logger('data:' + data);

    return true;
  }
}

(async () => {
  /**
   * /a/{b}
   *
   * @param path
   */
  function segment(path: string): SegmentCollection {
    const length = path.length;
    let i = -1;
    let j = 0;
    let depth = 0;

    const segments = new SegmentCollection();

    do {
      const char = path[++i];

      if (char === '{' || i === length) {
        if (depth > 0) {
          throw new SyntaxError('double {');
        }

        depth++; // up depth.

        if (j !== i) {
          segments.static(path.slice(j, i));
        }

        j = i;
      } else
      if (char === '}') {
        if (depth < 1) {
          throw new SyntaxError('} without {');
        }

        depth--; // down depth.

        segments.dynamic(path.slice(j + 1, i));

        j = i + 1;
      } else
      if (char === '\\') { // todo: isolation case.
        i++;
      }
    } while (i < length);

    return segments;
  }
  // console.log(`${/[\\\{]+/}`);

  const segments = segment('/a/b/c/{entry_id|number}');
  const request = '/a/b/c/123.2';

  logger(request);
  logger(segments.match(request));

  // console.log(
  //   'request: ', request,
  //   // path,
  //   '; ',
  //   'matches :', segments.match(request),
  // );

  //
  // collect([1, 2, 3])
  //   .listen(console.log);
})();
