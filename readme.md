# Fiorite (In development)

Fiorite is a development framework for building web applications using TypeScript/JavaScript.

## Packages

- [Core](./packages/core)
- [Database](./packages/db)
- [Http](./packages/http)

## Example

FP organization:

`@fiorite/pure` for micro apps and less code.

```typescript
import { provide, serve, ok } from '@fiorite/pure';

provide(x => {
    x.set('message', 'Hello world!'); // #1. configure
}).serve(y => {
    const message = y.get('message'), // #2. inject

    return ok(message); // #3. send
});
```

```
$ io serve --port=5000
$ curl http://127.0.0.1:5000

> 200 OK
> content-type: application/json
> 
> "Hello world!"
```

OOP organization: 

```typescript
import { AppBuilder, Scoped } from '@fiorite/core';
import { 
    JsonResponse, 
    Port, 
    Route, 
    Serve, 
    UrlQuery, 
} from '@fiorite/http';

@Scoped()
class HelloResponse extends JsonResponse {
  constructor(query: UrlQuery) {
    super(`Hello ${query.tryGet('to', 'world')}!`);
  }
}

class HelloController {
  @Route('**')
  handle(response: HelloResponse) {
    return response;
  }
}

@Serve()
class HelloInstance {
  configure(app: AppBuilder) {
    app.useAll([
      HelloResponse,
      HelloController,
    ]);
  }
}
```

```
$ io serve --port=5000
$ curl http://127.0.0.1:5000

> 200 OK
> content-type: application/json
> 
> "Hello world!"
```
