import { boot, Injector, Startup } from '@fiorite/core';
import { Logger } from '@fiorite/core/logger';

import { DbModule } from './db/module';
import { HeroCollection, HeroModule } from './hero';
import { HttpModule } from './http/module';

@boot class Application implements Startup {
  dependencies = [HttpModule, DbModule, HeroModule];

  constructor(private logger: Logger) { }

  async start(injector: Injector) {
    const server = injector.getHttpServer();

    for await (const context of server) {
      this.logger.info('[Application] Request with ID "' + context.request.id.toString() + '" accepted.');

      const hero = await injector(HeroCollection).first();
      await context.response.end('Hello world! - ' + hero.name);
    }
  }
}
