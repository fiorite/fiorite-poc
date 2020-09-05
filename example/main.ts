// TODO: App will be here.

import '@fiorite/http';
import '@fiorite/http/middlewares';
import { Logger } from '@fiorite/core/logger';
import { boot, Injector, ProviderCollection, Startup } from '@fiorite/core';

import { DbModule } from './db/module';
import { HeroCollection, HeroModule } from './hero';

@boot class Application implements Startup {
  dependencies = [
    DbModule,
    HeroModule,
  ];

  constructor(private logger: Logger) { }

  configure(providers: ProviderCollection): void | Promise<void> {
    providers.addHttpServer(5000)
      .addCorsMiddleware();
  }

  async start(injector: Injector) {
    const server = injector.getHttpServer();

    const heroes = injector(HeroCollection);

    for await (const context of server) {
      const hero = await heroes.first();

      this.logger.info('Request received with ID: ' + context.request.id)
      await context.response.end('App works! - ' + hero.name);
    }
  }
}


collect()
  .filter(x => x % 2 === 0)
  .reversed
  .count;
