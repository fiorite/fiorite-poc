// working file

import { Selector } from '../packages/core/operators/functional_types';
import { clone } from '../packages/core/cloning';
import { logger } from '../packages/core/logging';
import { RequestHandler } from '../packages/http/request_handler';
import { RouteCollection } from '../packages/http/routing/route_collection';
import { Router } from '../packages/http/routing/router';
import { first } from '../packages/core/operators';

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
  const router = new Router(
    new RouteCollection()
      .mapGet('/hello/{firstName}/{lastName}', () => void 0),
  );

  // ([a-zA-Z0-9-._~]|%[A-F0-9]{2}|[!$&\'()*+,;=]|[:@])+
  first()(
    router.route('/hello/~4._-bar:23AS!$&\'()*+,;=:@%AF%D1%82%D0%B5%D1%81%D1%82/foo23'),
  );
  // logger(Array.from(router.routes)[0].path);
  // logger(
  //   first()(router.route('/hello/eugen+!@()'))
  // );
})();
