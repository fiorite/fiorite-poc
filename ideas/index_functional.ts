import { AppBuilder, boot, Startup, injectable, Injector, Module, ProviderCollection } from '@fiorite/core';

// @injectable will expose constructor meta for injection.
@injectable class HelloMessage {
  value = 'Hello world!';
}

// @injectable will expose constructor meta for injection.
@injectable class HelloModule implements Module {
  // region Add providers using #providers property or provide() method.

  provides = [HelloMessage];

  // - or -

  configure(providers: ProviderCollection) {
    providers.add(HelloMessage);
  }

  // endregion
}

// region Run application using @bootable decorator or boot() function.

// @bootable will run your application immediately.
@boot class Application implements Startup {
  // region Add providers using #providers property or #provide() method.

  provides = [HelloMessage];

  // - or -

  provide(providers: ProviderCollection) {
    providers.add(HelloMessage);
  }

  // endregion

  // region Connect modules using #modules property or #configure() method.

  dependencies = [HelloModule];

  // - or -

  configure(app: AppBuilder) {
    app.add(HelloModule);
  }

  // endregion

  // Finally: run application.

  async start(inject: Injector) {
    inject(HelloMessage).value; // "Hello world!"
  }
}

// boot will run your application immediately.
boot({
  providers: [HelloMessage],

  // - or -

  modules: [HelloModule],

  // - or -

  configure(app: AppBuilder) {
    app.add(HelloModule);
  },

  // finally

  async start(inject: Injector) {
    inject(HelloMessage).value; // "Hello world!"
  },
});

// endregion
