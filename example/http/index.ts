import { HttpGet, ok, proxy, Request, serve } from '@fiorite/http';

serve(ctx => proxy('https://github.com/', ctx.request), 5000);
serve(() => ok('hello on 5001'), 5001);

class Controller {
  @HttpGet()
  getIndex() {
    return ok();
  }
}
