import '@fiorite/http';
import '@fiorite/http/middlewares';

import { Module, ProviderCollection } from '@fiorite/core';

export class HttpModule implements Module {
  configure(providers: ProviderCollection) {
    const port = process.env.PORT || 5000;

    providers.addHttpServer(port)
      .addCorsMiddleware();
  }
}
