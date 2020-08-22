import { Module, ProviderCollection, } from '@fiorite/core';
import { HttpContext } from '@fiorite/http';
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
      .useCors()
      .useResponseCache()
      .addRoute('**', FileEndpoint);
  }
}

createWebApp([Test]).run(5000);
