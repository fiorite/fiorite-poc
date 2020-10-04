import { DbQuery } from './db_query';
import { DbSchema } from './db_schema';

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

  /**
   * Inserts object to the database.
   *
   * @param object
   */
  insert?<E>(target: string, object: E): Promise<void>;

  /**
   * Updates object in the database.
   *
   * @param object
   */
  update?<E>(target: string, object: E): Promise<void>;

  /**
   * Deletes object from the database.
   *
   * @param object
   */
  delete?<E>(target: string, object: E): Promise<void>;

  /**
   * Get schema.
   */
  schema?(): Promise<DbSchema>;
}
