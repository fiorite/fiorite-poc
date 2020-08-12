import { ok, proxy, serve } from '@fiorite/http';
import { Consumer, Injector, ProviderCollection, Module, Scoped, Singleton, Transient, Type } from '@fiorite/core';

serve(ctx => proxy('https://github.com/', ctx.request), 5000);

serve(x => {
  return ok('hello on 5001');
}, 5001);

function hostModule(moduleType: Type<Module>, action: Consumer<Injector>) {
  const injector = new ProviderCollection();
  const moduleRef = Module.create(moduleType, injector);

  action(
    injector[Symbol.clone]()
      .addAll(moduleRef.services)
      .toInjector(),
  );
}

// Injector

@Transient()
class UniqueId extends String {
  constructor() {
    super('_' + Math.random().toString(36).substr(2, 9));
  }
}

@Singleton()
class Constant {
  readonly name = 'foo';

  constructor() { }
}

@Scoped()
class Context {
  constructor(readonly id: UniqueId, readonly constant: Constant) { }
}

class WebModule implements Module {
  provide(injector: ProviderCollection) {
    injector.addAll([UniqueId, Context, Constant]);
  }
}

hostModule(WebModule, x => {
  const context = x.get(Context);

  console.log(
    context.id, // _b71wtfl0w
    context.constant.name, // foo
    x.get(UniqueId), // _o207b1r1t
    x.get(UniqueId), // _rhjzhps2d
  );
});





