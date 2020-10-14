import { DbQuery } from './db_query';
import { DbMigrator } from './db_comparer';
import { DbModel } from '@fiorite/db/common/db_model';

export interface DbAdapter {
  readonly migrator?: DbMigrator;

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
   * @param model
   * @param object
   */
  insert?<E>(model: DbModel, object: E): Promise<void>;

  /**
   * Updates object in the database.
   *
   * @param model
   * @param object
   */
  update?<E>(model: DbModel, object: E): Promise<void>;

  /**
   * Deletes object from the database.
   *
   * @param model
   * @param object
   */
  delete?<E>(model: DbModel, object: E): Promise<void>;
}
