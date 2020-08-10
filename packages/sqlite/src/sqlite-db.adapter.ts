import { DbAdapter, DbQuery } from '@fiorite/db';

export class SqliteDbAdapter implements DbAdapter {
  query<E>(query: DbQuery): AsyncIterator<E> {
    throw new Error('Not implemented.');
  }
}
