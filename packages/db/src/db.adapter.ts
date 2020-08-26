import { DbQuery } from './db.query';

export interface DbAdapter {
  /**
   * Counts elements using query.
   *
   * @param query
   */
  count<E>(query: DbQuery): Promise<number>;

  /**
   * Perform {@param query} on a database and return {@link AsyncIterator}.
   *
   * @param query
   */
  query<E>(query: DbQuery): AsyncIterator<E>;
}
