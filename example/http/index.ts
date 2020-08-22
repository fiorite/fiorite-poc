import { createServer } from 'http';
import { Module, ProviderCollection, } from '@fiorite/core';
import { HttpContext, HttpServer, NodeHttpAdapter } from '@fiorite/http';
import { createWebApp, Endpoint, Route } from '@fiorite/web';

class FileDescriptor {
  readonly path = __dirname + '/image.jpeg';
  readonly type = 'image/jpeg';
}

@Route('**')
class FileEndpoint extends Endpoint {
  handle(context: HttpContext) {
    const description = context.getService(FileDescriptor);
    return this.file(description.path, description.type);
  }
}

class Test implements Module {
  configure(providers: ProviderCollection) {
    providers
      .addSingleton(FileDescriptor)
      .useCors({ origin: ['*'], methods: ['*'], headers: ['*'] })
      .useWebSockets()
      .useResponseCache()
      .addRoute('**', FileEndpoint);
  }
}

createWebApp([Test]).run(5000);

new HttpServer(NodeHttpAdapter.default).serve(context => {
  context.response.end();
}, 5001);

createServer((req, res) => {
  res.end();
}).listen(5002);
