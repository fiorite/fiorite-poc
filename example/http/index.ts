import { createServer } from 'http';
import { AsyncCollection, Injector, Module, ProviderCollection, Subject, } from '@fiorite/core';
import { HttpContext, HttpServer, NodeHttpAdapter } from '@fiorite/http';
import { createWebApp, Endpoint, Route } from '@fiorite/web';


(async () => {
  // Case study how build RxJS like code.

  const subject = new Subject<number>();

  subject
    .filter(x => x % 2 === 0)
    .tap(x => console.log('tap: ' + x))
    .listen(x => console.log('listen: ' + x))
    .then(() => console.log('stop listen!'));

  let i = 0;

  setInterval(() => {
    let limit = i + 100;

    for (; i < limit; i++) { // Add (n) elements.
      subject.add(i);
    }
  }, 1000);

  setTimeout(() => {
    subject.close();
  }, 5000);

  // await numbers.close();

  // operate(numbers).then(() => console.log('Operation done!'));

  async function operate(numbers: AsyncCollection<number>) {
    numbers.first(x => x === 20)
      .then(x => console.log('first: "' + x + '"'))
      .catch(error => console.error('first: ' + error));

    numbers.count()
      .then(count => console.log('count: ' + count));

    for await (const string of numbers) {
      console.log('for await ... of: ' + string);
    }
  }
})();

class FileDescriptor {
  readonly path = __dirname + '/image.jpeg';
  readonly type = 'image/jpeg';
}

@Route('**')
class FileEndpoint extends Endpoint {
  handle(context: HttpContext) {
    const description = context.getFeature(Injector).get(FileDescriptor);
    return this.file(description.path, description.type);
  }
}

class Test implements Module {
  configure(providers: ProviderCollection) {
    providers
      .add(FileDescriptor)
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
