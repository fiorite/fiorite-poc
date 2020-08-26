import { AsyncCollection, AsyncPredicate } from '@fiorite/core';

import { DbAdapter } from './db.adapter';
import { DbQuery } from './db.query';

export class DbCollection<E> extends AsyncCollection<E> {
  /**
   * Returns {@link DbQuery} object.
   */
  get query(): DbQuery {
    return { target: this.name, take: this.#take, skip: this.#skip };
  }

  /**
   * Skip number of elements. E.g OFFSET.
   */
  #skip: number | null = null;

  /**
   * Take number of elements. E.g LIMIT.
   */
  #take: number | null = null;

  /**
   * @param adapter Database adapter
   * @param name Collection name
   */
  constructor(readonly adapter: DbAdapter, readonly name: string) {
    super();
  }

  /**
   * @inheritDoc
   */
  count(...args: [] | [AsyncPredicate<E, [number]>]): Promise<number> {
    if (args.length < 1) { // TODO: Check whether adapter supports skip.
      return this.adapter.count(this.query);
    }

    // TODO: Maybe warning that operation is a little bit unsafe.
    return super.count(...args);
  }

  /**
   * @inheritDoc
   */
  first(...args: [] | [AsyncPredicate<E, [number]>]): Promise<E> {
    if (args.length < 1) { // TODO: Check whether adapter supports skip.
      this.#take = 1;
    } else {
      // TODO: Maybe warning that operation is a little bit unsafe.
    }

    return super.first(...args);
  }

  /**
   * @inheritDoc
   */
  skip(count: number): DbCollection<E> {
    if (true) { // TODO: Check whether adapter supports skip.
      this.#skip = count;

      return this;
    }

    return super.skip(count) as DbCollection<E>;
  }

  /**
   * @inheritDoc
   */
  take(count: number): DbCollection<E> {
    if (true) { // TODO: Check whether adapter supports take.
      this.#take = count;

      return this;
    }

    return super.take(count) as DbCollection<E>;
  }

  /**
   * @inheritDoc
   */
  [Symbol.asyncIterator](): AsyncIterator<E> {
    return this.adapter.query(this.query);
  }
}
