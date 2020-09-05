# Fiorite

Fiorite is a development framework for building web applications using TypeScript/JavaScript.

- ⚠️ Status: **In development**

## TODO

- [ ] Bigint polyfill

## Package structuring

Available packages (3 at the moment):

- `@fiorite/core` - modules, boot, app, di, injection
    - `@fiorite/core/operators` - sync/async iterable operators
    - `@fiorite/core/collections` - sync/async collections + structures
    - `@fiorite/core/logging` - logging functionality
    - `@fiorite/core/provider_collection` - provider collection for extension
    - `@fiorite/core/injector` - injector for extension


- `@fiorite/http` - server, client, context, middleware
    - `@fiorite/http/middlewares` - built-in middlewares
    - `@fiorite/http/responses` - built-in responses
    - `@fiorite/http/routing` - routing feature, controller, endpoint etc.


- `@fiorite/db` - db collection, context, and adapter (abstractions)
    - `@fiorite/db/sqlite` - sqlite adapter and extensions

## Notes

The main idea of the framework is to provide rich functionality to solve problems with different complexity using hybrid model of object-oriented and functional paradigms.

Treasure of Fiorite is combination of synchronous and asynchronous collections that use native iterable protocol, 
custom data structures that have control over equality comparison and provide solid api to interact with them:

- `List<E>` – similar to native `Array<T>`
- `LinkedList<E>`
- `HashSet<E>` – similar to native `Set<T>`
- `HashMap<K, V>` – similar to native `Map<K, V>`
- `Queue<E>`
- `Stack<E>`
- `CollectionSubject<E>` – similar to RxJS `Subject<T>`.

So get into some collection features:

- Collection can work with `Array<T>`, `Set<T>`, `Map<K, V>` and `Object` that implements `Iterable<T>` iterable. 
You can iterate collection using `for ... of`.  

```typescript
import { collect } from '@fiorite/core';

const array = [1, 2, 3];
const set = new Set(array);
const map = new Map(array.map(x => [x, x]));

const collection = collect(array); // [Collection [1, 2, 3]]
collect(set); // [Collection [1, 2, 3]]
collect(map); // [Collection [[1, 1], [2, 2], [3, 3]]]

for (const x of collection) {
  x; // 1 ... 2 ... 3
}
```
 
- Async collection can work with `Readable` stream and `Object` that implements `AsyncIterable<T>`.
You can iterate collection using `for await ... of`.

```typescript
import { collect } from '@fiorite/core';

const stream = Readable.from([1, 2, 3]);
const collection = collect(stream); // [AsyncCollection [1, 2, 3]]

for await (const x of collection) {
  x; // 1 ... 2 ... 3
}
```

- Methods of both collections are similar and the same as in `Array<T>`, so that you don't have to remember specific rules.

```typescript
import { collect } from '@fiorite/core';

const collection = collect([1, 2, 3]);

operate(collection); // [Collection [2, 3, 4]]
operate(collection.toAsync()); // [AsyncCollection [2, 3, 4]]

const operate = (collection: Collection<number> | AsyncCollection<number>) => {
  return collection.map(x => x + 1);
} 
```

- Every method that projects a new sequence returns a new collection, so you can effectively chain pipeline.

```typescript
import { collect } from '@fiorite/core';

collect([1, 2, 3]).map(x => x + 1).filter(x => x % 2 === 0); // [Collection [2, 4]]
```  

- Every collection has wide set of built-in operators:

    - append 
    - concat 
    - count
    - every
    - filter
    - first
    - flat
    - flatMap
    - forEach
    - includes
    - listen
    - map
    - prepend
    - reduce
    - reverse
    - single
    - skip
    - some 
    - take
    - tap
    - toArray
    - toSync
    - toAsync


## Requirements

- ES2019 (for private properties)
- ES2017 (identify async function)
- TypeScript 2.8

## TODO

- [x] Finalize injection proto: scopes, clarify terms (service/provider/injector etc)
- [x] Add response to HttpContext, add RequestCallback instead of linear result.
- [x] Investigate websockets implementation (socket.io, ws)
- [x] Fill out response header enum, add facade accessor for known headers.
- [ ] Implement Url interface.
- [ ] Consider whether it's a good idea to provide adapters for express/restify etc.
- [ ] Implement router as a middleware. Make it configurable (reuse other).
- [ ] Think about angular ssr solution.
- [ ] Inspect improvements (make collection readable).
 
 
- [ ] Add reflect manager to store reflected metadata.
- [ ] Implement `@singletone`, `@scoped`, `@transient`, `@inject`, `@injectAll` decorators.
- [ ] Add tests for `di` component.  
