# Core

Package provides core interfaces that are useful across the framework.    

### Collections

Path: `@fiorite/core`

`abstract class Collection<E> implements Iterable<E>`

| Method | Description |
|---|---|
| `#filter(Predicate<E, [number]>): Collection<E>` | - |
| `#forEach(Consumer<E, [number]>): void` | Perform the `Consumer<E, [number]>` on each element `E` in a sequence. |
| `#map<R>(Selector<E, R, [number]>): Collection<R>` | - |
| `#toArray(): E[]` | Converts a sequence to `E[]`. |
    
`abstract class AsyncCollection<E> implements AsyncIterable<E>`
    
| Method | Description |
|---|---|
| `#filter(AsyncPredicate<E, [number]>): AsyncCollection<E>` | - |
| `#forEach(AsyncConsumer<E, [number]>): Promise<void>` | Perform the `AsyncConsumer<E, [number]>` on each element `E` in a sequence. |
| `#map<R>(AsyncSelector<E, R, [number]>): AsyncCollection<R>` | - |
| `#toArray(): Promise<E[]>` | Converts a sequence to `E[]`. |

### Functional types

Path: `@fiorite/core`

| Type | Signature | Description |
|---|---|---|
| `PromiseOr<T>` | `T or Promise<T>` | Represents synchronous `T` or asynchronous `Promise<T>` type. |
| `Consumer<E, A = never[]>` | `(E, ...A) => void` | Action that performs on element `E` and returns no result. |
| `AsyncConsumer<E, A = never[]>` | `(E, ...A) => PromiseOr<void>` | Action that performs on element `E` and returns no result. |
| `Predicate<E, A = never[]>` | `(E, ...A) => boolean` | Action that performs on element `E` and returns `boolean` result. |
| `AsyncPredicate<E, A = never[]>` | `(E, ...A) => PromiseOr<boolean>` | Action that performs on element `E` and returns `boolean` result. |
| `Selector<E, R = E, A = never[]>` | `(E, ...A) => R` | Action that performs on element `E` and returns `R` result. |
| `AsyncSelector<E, R = E, A = never[]>` | `(E, ...A) => PromiseOr<R>` | Action that performs on indexed element `E` and returns `R` result. |

### Iterable operators

Path: `@fiorite/core/operators`

| Operator | Description |
|---|---|
| `forEach<E>(Iterable<E>, Consumer<E, [number]>): void` | Performs the `Consumer<E, [number]>` for each element `E` in an `Iterable<R>`. |
| `forEachAsync<E>(AsyncIterable<E>, AsyncConsumer<E, [number]>): Promise<void>` | Performs the `AsyncConsumer<E, [number]>` for each element `E` in an `AsyncIterable<R>`. |
| `toArray<E>(Iterable<E>): E[]` | Converts an `Iterable<E>` to `E[]`. |
| `toArrayAsync<E>(AsyncIterable<E>): Promise<E[]>` | Converts an `AsyncIterable<E>` to `E[]`. |

