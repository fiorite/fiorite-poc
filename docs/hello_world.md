# Hello world!



So, lets build console 'Hello world!' app:

```typescript
// main.ts
import { boot, Startup } from '@fiorite/core';
import { Logger } from '@fiorite/core/logger';

@boot class Application implements Startup {
  constructor(private logger: Logger) { }

  start() {
    this.logger.info('App works!');  
  }
}

```

Now, we are going to add http server:

```typescript
// main.ts

import { boot, Injector, ProviderCollection, Startup } from '@fiorite/core';

@boot class Application implements Startup {
  configure(providers: ProviderCollection) {
    providers.addHttpServer(5000);
  }

  async start(injector: Injector) {
    const server = injector.getHttpServer();

    for await (const context of server) {
      context.response.end('App works!');
    }
  }
}

```

Now, lets connect a database:

```typescript
// main.ts
import { boot, Injector, ProviderCollection, Startup } from '@fiorite/core';
import { HttpServer } from '@fiorite/http';
import { DbContext } from '@fiorite/db';
import '@fiorite/db/sqlite';

interface Hero {
  name: string; 
}

@boot class Application implements Startup {
  configure(providers: ProviderCollection) {
    const port = process.env.PORT || 5000;

    providers.addHttpServer(port)
        .addSqliteDb(':memory:');
  }

  start(inject: Injector) {
    const server = inject(HttpServer);
    const heroes = inject(DbContext).collect<Hero>('heroes'); 

    for await (const context of server) {
        const myHero = await heroes.first();
        context.response.end('Hello world! – ' + myHero.name);    
    }
  }
}
```
