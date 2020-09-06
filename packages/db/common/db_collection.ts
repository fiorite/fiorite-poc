import { AsyncCollection } from '@fiorite/core/collections/async_collection';
import { AnyPredicate,  } from '@fiorite/core/types';

import { DbAdapter } from './db_adapter';
import { DbQuery } from './db_query';

export class DbCollection<E> extends AsyncCollection<E> {
  /**
   * Returns {@link DbQuery} object.
   */
  get query(): DbQuery {
    return { target: this.name, take: this._take, skip: this._skip };
  }

  /**
   * Skip number of elements. E.g OFFSET.
   */
  private _skip: number | null = null;

  /**
   * Take number of elements. E.g LIMIT.
   */
  private _take: number | null = null;

  /**
   * @param adapter Database adapter
   * @param name Collection name
   */
  constructor(readonly adapter: DbAdapter, readonly name: string) {
    super();
  }

  insert(object: E) {
    return this.adapter.insert(this.name, object);
  }

  update(object: E) {
    return this.adapter.update(this.name, object);
  }

  delete(object: E) {
    return this.adapter.delete(this.name, object);
  }

  /**
   * Returns the first element of a database.
   */
  first(): Promise<E>;

  /**
   * Returns the first element of a database that satisfies a predicate.
   *
   * @deprecated The operation is performed at the JS level. Use `#first()` without predicate instead.
   *
   * @param predicate
   */
  first(predicate: AnyPredicate<[E]>): Promise<E>;

  /**
   * @inheritDoc
   */
  first(...args: any[]) {
    if (args.length < 1) {
      this.take(1);

      return super.first();
    }

    return super.first(...args);
  }

  /**
   * Counts the number of elements in a sequence
   *
   * @inheritDoc
   */
  count(): Promise<number>;

  /**
   * Counts the number of elements in a sequence that satisfy the predicate.
   *
   * @deprecated The operation is performed at the JS level. Use `#count()` without predicate instead.
   */
  count(predicate: AnyPredicate<[E]>): Promise<number>;

  /**
   * @inheritDoc
   */
  count(...args: any[]) {
    if (args.length < 1) { // TODO: Check whether adapter supports skip.
      return this.adapter.count(this.query);
    }

    // TODO: Add warning.
    return super.count(...args);
  }

  // /**
  //  * @inheritDoc
  //  */
  // first(...args: [] | [AsyncPredicate<E, [number]>]): Promise<E> {
  //   if (args.length < 1) { // TODO: Check whether adapter supports skip.
  //     this._take = 1;
  //   } else {
  //     // TODO: Maybe warning that operation is a little bit unsafe.
  //   }
  //
  //   return super.first(...args);
  // }

  /**
   * @inheritDoc
   */
  skip(count: number): DbCollection<E> {
    this._skip = count;

    return this;
  }

  /**
   * @inheritDoc
   */
  take(count: number): DbCollection<E> {
    this._take = count;

    return this;
  }

  /**
   * @inheritDoc
   */
  [Symbol.asyncIterator](): AsyncIterator<E> {
    return this.adapter.query(this.query);
  }
}
