import { boot, Startup, Injector } from '@fiorite/core';

@boot class Application implements Startup {
  start(inject: Injector) {
    console.log('Application works!');
  }
}

// - or -

boot({
  start(inject: Injector) {
    console.log('Application works!');
  }
});

// - or -

boot((inject: Injector) => console.log('Application works!'));

