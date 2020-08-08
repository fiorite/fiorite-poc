import { AsyncCollection } from '@fiorite/core';

import { DbAdapter } from './db.adapter';
import { DbQuery } from './db.query';

export class DbCollection<E> extends AsyncCollection<E> {
  /**
   * Returns {@link DbQuery} object.
   */
  get query(): DbQuery {
    return { target: this.name };
  }

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
  [Symbol.asyncIterator](): AsyncIterator<E> {
    return this.adapter.query(this.query);
  }
}
