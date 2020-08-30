import { Database } from 'sqlite3';

import { DbAdapter, DbQuery } from '@fiorite/db';
import { SqliteDbIterator } from './sqlite-db.iterator';
import { Logger } from '@fiorite/core/logger';

export class SqliteDbAdapter implements DbAdapter {
  constructor(readonly database: Database, readonly logger: Logger) { }

  count<E>(query: DbQuery): Promise<number> {
    return Promise.resolve(0);
  }

  query<E>(query: DbQuery): AsyncIterator<E> {
    let sql = `SELECT * FROM \`${query.target}\``;

    if (query.take !== null) {
      sql += ` LIMIT ${query.take}`;
    }

    if (query.skip !== null) {
      sql += ` OFFSET ${query.skip}`;
    }

    this.logger.verbose('[SqliteDbAdapter] Query is prepared "' + sql + '"');

    const statement = this.database.prepare(sql);

    return new SqliteDbIterator(statement);
  }
}
