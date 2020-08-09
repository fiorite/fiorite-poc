# Core

Package provides core interfaces that are useful across the framework.    

### Collections

Path: `@fiorite/core`

`abstract class Collection<E> implements Iterable<E>`

| Method | Description |
|---|---|
| `#forEach(IndexedConsumer<E>): void` | Perform the `Consumer<E>` on each element `E` in a sequence. |
| `#toArray(): E[]` | Converts a sequence to `E[]`. |
    
`abstract class AsyncCollection<E> implements AsyncIterable<E>`
    
| Method | Description |
|---|---|
| `#forEach(IndexedAsyncConsumer<E>): Promise<void>` | Perform the `AsyncConsumer<E>` on each element `E` in a sequence. |
| `#toArray(): Promise<E[]>` | Converts a sequence to `E[]`. |

### Functional types

Path: `@fiorite/core`

| Type | Signature | Description |
|---|---|---|
| `PromiseOr<T>` | `T or Promise<T>` | Represents synchronous `T` or asynchronous `Promise<T>` type. |
| `Consumer<E>` | `(E) => void` | Action that performs on element `E` and returns no result. |
| `IndexedConsumer<E>` | `(E, number) => void` | Action that performs on  indexed element `E` and returns no result. |
| `AsyncConsumer<E>` | `(E) => PromiseOr<void>` | Action that performs on element `E` and returns no result. |
| `IndexedAsyncConsumer<E>` | `(E, number) => PromiseOr<void>` | Action that performs on indexed element `E` and returns no result. |
| `Predicate<E>` | `(E) => boolean` | Action that performs on element `E` and returns `boolean` result. |
| `IndexedPredicate<E>` | `(E, number) => boolean` | Action that performs on indexed element `E` and returns `boolean` result. |
| `AsyncPredicate<E>` | `(E) => PromiseOr<boolean>` | Action that performs on element `E` and returns `boolean` result. |
| `IndexedAsyncPredicate<E>` | `(E, number) => PromiseOr<boolean>` | Action that performs on indexed element `E` and returns `boolean` result. |
| `Selector<E, R>` | `(E) => R` | Action that performs on element `E` and returns `R` result. |
| `IndexedSelector<E, R>` | `(E, number) => R` | Action that performs on indexed element `E` and returns `R` result. |
| `AsyncSelector<E, R>` | `(E) => PromiseOr<R>` | Action that performs on indexed element `E` and returns `R` result. |
| `IndexedAsyncSelector<E, R>` | `(E, number) => PromiseOr<R>` | Action that performs on indexed element `E` and returns `R` result. |

### Iterable operators

Path: `@fiorite/core/operators`

| Operator | Description |
|---|---|
| `forEach<E>(Iterable<E>, IndexedConsumer<E>): void` | Performs the `Consumer<E>` for each element `E` in an `Iterable<R>`. |
| `forEachAsync<E>(AsyncIterable<E>, IndexedAsyncConsumer<E>): Promise<void>` | Performs the `IndexedAsyncConsumer<E>` for each element `E` in an `AsyncIterable<R>`. |
| `toArray<E>(Iterable<E>): E[]` | Converts an `Iterable<E>` to `E[]`. |
| `toArrayAsync<E>(AsyncIterable<E>): Promise<E[]>` | Converts an `AsyncIterable<E>` to `E[]`. |

