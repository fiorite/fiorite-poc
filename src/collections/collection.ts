import {
  append,
  average,
  concat,
  count,
  distinct,
  elementAt,
  every,
  except,
  filter,
  first,
  flat,
  flatMap,
  forEach,
  includes,
  indexOf,
  intersect,
  last,
  lastIndexOf,
  map,
  max,
  min,
  Operator,
  prepend,
  reduce,
  Reducer,
  reverse,
  sequenceEqual,
  single,
  skip,
  skipWhile,
  some,
  take,
  takeWhile,
  toArray,
} from '../operators';
import { getIterator } from '../iteration';
import { Callback, defaultEqualityComparer, EqualityComparer, Predicate, Selector } from '..';

export abstract class Collection<E> implements Iterable<E> {
  get [Symbol.toStringTag]() {
    return 'Collection';
  }
  
  get empty(): boolean {
    return !this.some();
  }

  abstract pipe<R>(operator: Operator<E, Iterable<R>>): Collection<R>;

  append(...elements: E[]): Collection<E> {
    return this.pipe(append(...elements));
  }

  average(...args: E extends number ? [] : [Selector<E, number>]): number {
    return average<E>(...args)(this);
  }

  cast<R>(): Collection<R> {
    return this as unknown as Collection<R>;
  }

  concat(...others: Iterable<E>[]): Collection<E> {
    return this.pipe(concat(...others as Iterable<E>[]));
  }

  count(predicate?: Predicate<E>): number;
  count(...args: any[]): number {
    return count(...args)(this);
  }

  distinct(comparer: EqualityComparer<E> = defaultEqualityComparer): Collection<E> {
    return this.pipe(distinct(comparer));
  }

  elementAt(index: number): E {
    return elementAt<E>(index)(this);
  }

  every(predicate: Predicate<E>): boolean {
    return every(predicate)(this);
  }

  except(other: Iterable<E>, comparer: EqualityComparer<E> = defaultEqualityComparer): Collection<E> {
    return this.pipe(except(other as Iterable<E>, comparer));
  }

  filter(predicate: Predicate<E>): Collection<E> {
    return this.pipe(filter(predicate));
  }

  first(predicate?: Predicate<E>): E;
  first(...args: any[]) {
    return first(...args)(this);
  }

  flat(): Collection<E extends Iterable<infer P> ? P : E> {
    return this.pipe(flat<E>());
  }

  flatMap<R>(selector: Selector<E, R | Iterable<R>>): Collection<R> {
    return this.pipe(flatMap(selector));
  }

  forEach(callback: Callback<[E]>): void {
    return forEach(callback)(this);
  }

  includes(element: E, comparer = defaultEqualityComparer): boolean {
    return includes(element, comparer)(this);
  }

  indexOf(element: E, comparer = defaultEqualityComparer): number {
    return indexOf(element, comparer)(this);
  }

  intersect(other: Iterable<E>, comparer: EqualityComparer<E> = defaultEqualityComparer): Collection<E> {
    return this.pipe(intersect(other as Iterable<E>, comparer));
  }

  last(predicate?: Predicate<E>): E;
  last(...args: any[]) {
    return last(...args)(this);
  }

  lastIndexOf(element: E, comparer = defaultEqualityComparer): number {
    return lastIndexOf(element, comparer)(this);
  }

  map<R>(selector: Selector<E, R>): Collection<R> {
    return this.pipe(map(selector));
  }

  max(...args: E extends number ? [] : [Selector<E, number>]): number {
    return max<E>(...args)(this);
  }

  min(...args: E extends number ? [] : [Selector<E, number>]): number {
    return min<E>(...args)(this);
  }

  prepend(...elements: E[]): Collection<E> {
    return this.pipe(prepend(...elements));
  }

  reduce(reducer: Reducer<E, E>): E;
  reduce<A>(reducer: Reducer<E, A>, seed: A): A;
  reduce<A, R>(reducer: Reducer<E, A>, seed: A, selector: Selector<A, R>): R;
  reduce(...args: any[]): unknown {
    return (reduce as any)(this, ...args);
  }

  reverse(): Collection<E> {
    return this.pipe(reverse<E>());
  }

  sequenceEqual(other: Iterable<E>, comparer: EqualityComparer<E> = defaultEqualityComparer): boolean {
    return sequenceEqual(other as Iterable<E>, comparer)(this);
  }

  single(predicate?: Predicate<E>): E;
  single(...args: any[]) {
    return single(...args)(this);
  }

  skip(count: number): Collection<E> {
    return this.pipe(skip<E>(count));
  }

  skipWhile(predicate: Predicate<E>): Collection<E> {
    return this.pipe(skipWhile(predicate));
  }

  some(predicate?: Predicate<E>): boolean;
  some(...args: any[]) {
    return some(...args)(this);
  }

  sum(...args: E extends number ? [] : [Selector<E, number>]): number {
    return min<E>(...args)(this);
  }

  take(count: number): Collection<E> {
    return this.pipe(take<E>(count));
  }

  takeWhile(predicate: Predicate<E>): Collection<E> {
    return this.pipe(takeWhile(predicate));
  }

  toArray(): E[] {
    return toArray<E>()(this);
  }

  abstract [Symbol.iterator](): Iterator<E>;
}

export class CollectionProxy<E> extends Collection<E> {
  constructor(readonly iterable: Iterable<E>) {
    super();
  }

  pipe<R>(operator: Operator<E, Iterable<R>>): CollectionProxy<R> {
    return new CollectionProxy<R>(operator(this));
  }

  [Symbol.iterator](): Iterator<E> {
    return getIterator(this.iterable);
  }
}

