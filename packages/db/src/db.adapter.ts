import { DbQuery } from './db.query';

export interface DbAdapter {
  /**
   * Perform {@param query} on a database and return {@link AsyncIterator}.
   *
   * @param query
   */
  query<E>(query: DbQuery): AsyncIterator<E>;
}
