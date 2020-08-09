# HTTP

Package provides interfaces to serve or request resources through HTTP protocol.   

Idea for `@fiorite/pure`.

```typescript
import { sqlite } from '@fiorite/sqlite';
import { redis } from '@fiorite/redis';

import { serve, ok, unfound } from '@fiorite/http';

/**
 * - Enable cors middleware;
 * - Connect database to context;
 * - Connect redis to context;
 * - Bind 5000 port;
 * - Bind several routes;
 * - Start web server;
 */
serve({
  cors: true,
  db: () => sqlite(':memory:'),
  cache: () => redis(),
  port: 5000,
  routes: {
    ['/']: req => ok(`Hello ${req.query('name', 'World')}!`),
    ['/:id'](req, ctx) {
        return ctx.cache('pages').find(req.param('id'), 
            id => ctx.db('pages').find(id),
        );
    },
    ['/github']: req => req.proxy('https://github.com/'),
    ['**']: () => unfound('Enpoint is not found'),
  } 
});
```
