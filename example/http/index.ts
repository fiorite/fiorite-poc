import { ok, proxy, serve } from '@fiorite/http';
import {
  Callback,
  Injection,
  Injector,
  InjectorBuilder,
  Module,
  Scoped,
  Singleton,
  Transient,
  Type
} from '@fiorite/core';

// serve(ctx => proxy('https://github.com/', ctx.request), 5000);

serve(x => {
  x.response.setHeader('Server', 'Fiorite');
  x.response.body.end('Hello on 5001');
  // return ok('hello on 5001');
}, 5001);

function hostModule(moduleType: Type<Module>, action: Callback<Injector>) {
  const injector = new InjectorBuilder();
  const moduleRef = Module.create(moduleType, injector);

  action(
    injector[Symbol.clone]()
      .addAll(moduleRef.injector)
      .build(),
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
  constructor(readonly id: UniqueId, readonly constant: Constant, readonly injector: Injector) { }
}

class WebModule implements Module {
  provide(injector: InjectorBuilder) {
    // injector.
    injector.addAll([UniqueId, Context, Constant]);
  }
}

hostModule(WebModule, x => {
  const context = x.get(Context);

  x.awaitAll()

  console.log(
    context.injector,
    context.id, // _b71wtfl0w
    context.constant.name, // foo
    x.get(UniqueId), // _o207b1r1t
    x.get(UniqueId), // _rhjzhps2d
  );
});
