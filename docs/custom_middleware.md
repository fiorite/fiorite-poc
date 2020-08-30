# Custom middleware

First, we have implement `Middleware` or inherit from it. Current interface is located in `@fiorite/http` package.  

Example:

```typescript
// ping_middleware.ts

import { Logger } from '@fiorite/core/logger';
import { HttpContext, Middleware, RequestCallback } from '@fiorite/http';

export class PingMiddleware implements Middleware {
  constructor(private logger: Logger) { }

  async handle(context: HttpContext, next: RequestCallback) {
    this.logger.info('Ping');

    await next(context); // Wait until other middlewares execute. 

    this.logger.info('Pong');
  }
}
```

Then, you can connect it to your application. In order to have `ProviderCollection#addMiddleware()` method we have to import `@fiorite/http`. 

Example:

```typescript
// main.ts

// Current import exposes ProvideCollection#addMiddleware() method.
import '@fiorite/http';

import { boot, Injector, ProviderCollection, Startup } from '@fiorite/core';
import { Logger } from '@fiorite/core/logger';

import { PingMiddleware } from './ping_middleware.ts';

@boot class Application implements Startup {
  configure(providers: ProviderCollection) {
    providers
      .addHttpServer(5000)
      .addMiddleware(inject => new PingMiddleware(inject(Logger)));
  }

  async start(injector: Injector) {
    const server = injector.getHttpServer();

    for await (const context of server) {
      context.response.end('App works!');
    }
  }
}
```

## Custom provider extension

In order to deliver better interface, we can encapsulate provider configuration logic using extensions.

Detailed information about `Module Augmentation` you can find here [here](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation). 

To extends `ProviderCollection` we have to use `@fiorite/core/extension_api` path instead of `@fiorite/core`.

Example:

```typescript
// ping_extension.ts

import '@fiorite/http';

import { ProviderCollection } from '@fiorite/core/extension_api';
import { Logger } from '@fiorite/core/logger';

import { PingMiddleware } from './ping_middleware.ts';

declare module '@fiorite/core/extension_api' {
  interface ProviderCollection {
    addPingMiddleware(): this;
  }
}

ProviderCollection.prototype.addPingMiddleware = function(this: ProviderCollection) {
  return this.addMiddleware(inject => new PingMiddleware(inject(Logger)));
}
```

Now, we can add `PingMiddleware` without extra effort.

Example:

```typescript
// main.ts

import { boot, Injector, ProviderCollection, Startup } from '@fiorite/core';

import './ping_extension';

@boot class Application implements Startup {
  configure(providers: ProviderCollection) {
    providers
      .addHttpServer(5000)
      .addPingMiddleware();
  }

  async start(injector: Injector) {
    const server = injector.getHttpServer();

    for await (const context of server) {
      context.response.end('App works!');
    }
  }
}
```
