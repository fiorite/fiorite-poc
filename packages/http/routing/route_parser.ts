import { RoutePath } from './route_path';
import { SegmentCollection } from './segment_collection';

export class RouteParser {
  static readonly default = new RouteParser();

  private constructor() { }

  parse(path: string): RoutePath {
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

        depth++;

        if (j !== i) {
          segments.addStatic(path.slice(j, i));
        }

        j = i;
      } else
      if (char === '}') {
        if (depth < 1) {
          throw new SyntaxError('} without {');
        }

        depth--;

        segments.addDynamic(path.slice(j + 1, i));

        j = i + 1;
      } else
      if (char === '\\') {
        i++;
      }
    } while (i < length);

    return new RoutePath(segments);
  }
}
