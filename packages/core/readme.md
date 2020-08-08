# Core

Package provides core interfaces that are useful across the framework.    

### Collections

Path: `@fiorite/core`

`abstract class Collection<E> implements Iterable<E>`

| Method | Description |
|---|---|
| `#forEach(Consumer<E>): void` | Perform the `Consumer<E>` on each element `E` in a sequence. |
| `#toArray(): E[]` | Converts a sequence to `E[]`. |
    
`abstract class AsyncCollection<E> implements AsyncIterable<E>`
    
| Method | Description |
|---|---|
| `#forEach(AsyncConsumer<E>): Promise<void>` | Perform the `AsyncConsumer<E>` on each element `E` in a sequence. |
| `#toArray(): Promise<E[]>` | Converts a sequence to `E[]`. |

### Functional types

Path: `@fiorite/core`

| Type | Signature | Description |
|---|---|---|
| `PromiseOr<T>` | `T or Promise<T>` | Represents synchronous `T` or asynchronous `Promise<T>` type. |
| `Consumer<E>` | `(E, number) => void` | Action that performs on  indexed element `E` and returns no result. |
| `AsyncConsumer<E>` | `(E, number) => PromiseOr<void>` | Action that performs on indexed element `E` and returns no result. |
| `Predicate<E>` | `(E, number) => boolean` | Action that performs on indexed element `E` and returns `boolean` result. |
| `AsyncPredicate<E>` | `(E, number) => PromiseOr<boolean>` | Action that performs on indexed element `E` and returns `boolean` result. |
| `Selector<E, R>` | `(E, number) => R` | Action that performs on indexed element `E` and returns `R` result. |
| `AsyncSelector<E, R>` | `(E, number) => PromiseOr<R>` | Action that performs on indexed element `E` and returns `R` result. |

### Iterable operators

Path: `@fiorite/core/operators`

| Operator | Description |
|---|---|
| `forEach<E>(Iterable<E>, Consumer<E>): void` | Performs the `Consumer<E>` for each element `E` in an `Iterable<R>`. |
| `forEachAsync<E>(AsyncIterable<E>, AsyncConsumer<E>): Promise<void>` | Performs the `AsyncConsumer<E>` for each element `E` in an `AsyncIterable<R>`. |
| `toArray<E>(Iterable<E>): E[]` | Converts an `Iterable<E>` to `E[]`. |
| `toArrayAsync<E>(AsyncIterable<E>): Promise<E[]>` | Converts an `AsyncIterable<E>` to `E[]`. |

