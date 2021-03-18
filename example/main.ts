// working file

import { RouteCollection } from '../packages/http/routing/route_collection';
import { Router } from '../packages/http/routing/router';
import { first, prepend } from '../packages/core/operators';
import { RouteParser } from '../packages/http/routing/route_parser';
import { Route } from '../packages/http/routing/route';
import { logger } from '../packages/core/logging';
import { BinaryTree } from '../packages/core/tries/binary/tree';
import { traversePreOrder } from '../packages/core/tries/traversal/pre_order';
import { BinaryTreeNode } from '../packages/core/tries/binary/node';
import { RadixTree } from '../packages/core/tries/radix/tree';

const handler = () => void 0;

(async () => {
  const router = new Router(
    new RouteCollection()
      .mapGet('/posts/{id|uuid}.{format|char(3)}', handler)
      // .mapGet('/hello/{a}/{b}', handler)
      .mapGet('{path*}', handler),
  );

  console.log(
    first()(
      router.route('/hello/~4._-bar:23AS!$&\'()*+,;=:@%AF%D1%82%D0%B5%D1%81%D1%82/foo23'),
    ),
  );
})();
