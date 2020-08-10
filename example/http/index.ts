import { HttpHeaders, HttpHeader, ok, proxy, serve, HttpGet, Request } from '@fiorite/http';
import { Inject, Injectable } from '@fiorite/core';

serve(ctx => proxy('https://github.com/', ctx.request), 5000);

serve(x => {
  console.log(x.injector.map(x => x.name).toArray());
  return ok('hello on 5001');
}, 5001);

// Injector

@Injectable()
class Controller {
  constructor(@Inject() request: Request) { }

  @HttpGet()
  getIndex(@HttpHeader('accept') accepts: string[]) { }
}
