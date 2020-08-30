import { promisify } from 'util';
import { Database } from 'sqlite3';

import { Module, ProviderCollection, wire } from '@fiorite/core';
import { DbContext } from '@fiorite/db';
import { SqliteDbAdapter } from '@fiorite/db/sqlite';
import { Logger } from '@fiorite/core/logger';

@wire class DbModule implements Module {
  constructor(private logger: Logger) { }

  async configure(providers: ProviderCollection) {
    const database = new Database(':memory:');
    this.logger.info('[Sqlite] Database ":memory:" is connected.');

    await promisify(database.exec.bind(database))('CREATE TABLE IF NOT EXISTS heroes (name TEXT PRIMARY KEY)');
    this.logger.verbose('[Sqlite] Query is executed "CREATE TABLE IF NOT EXISTS heroes (name TEXT PRIMARY KEY)"');

    await promisify(database.exec.bind(database))('INSERT INTO heroes (name) VALUES ("Unknown")');
    this.logger.verbose('[Sqlite] Query is executed "INSERT INTO heroes (name) VALUES ("Unknown")"');

    // @ts-ignore
    providers.add(DbContext, inject => {
      const adapter = new SqliteDbAdapter(database, inject(Logger));
      return new DbContext(adapter);
    })
  }
}

export { DbModule };
