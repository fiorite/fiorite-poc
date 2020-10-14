import { collect } from '@fiorite/core';
import { buildDb, compareSchemas, migrateDbUp } from '@fiorite/db';
import { Database } from 'sqlite3';
import { join } from 'path';
import { SqliteDbAdapter, SqliteDbMigrator } from '../packages/db/sqlite';

interface Person {
  id: string;
  name: string;
  age: number;
}

interface WithId {
  id: string;
}

(async () => {
  const items = collect([1, 2, 3])
    .append(1, 2, 3)
    .concat([1, 2, 3]);
  //
  // console.log(items);
  // items.forEach(console.log);

  // const connection = await connect();
  // const channel = await connection.createChannel();
  //
  // const queue = new RabbitQueue(channel);
  // const message = await queue.dequeue();
  // message.content;
  //
  // queue.listen(message => {
  //   message.content
  // });
  //
  // console.log(abc);


  // const db = new DbBuilder();

  const database = new Database(join(__dirname, 'main.db'));

  const adapter = new SqliteDbAdapter(
    database,
    new SqliteDbMigrator(database),
  );

  // 1. find to insert
  // 2. find to delete
  // 3. find similar

  // const expected = new DbBuilder()
  //   .add('users')
  //   .add('posts')
  //   .build();

  const ms = [
    { // model
      name: 'posts',
      fields: [
        { // field
          name: 'id',
          type: 'varchar(20)',
        },
        { // field
          name: 'name',
          type: 'varchar(20)',
        },
        { // field
          name: 'created',
          type: 'date',
        },
      ],
    }
  ];

  const current = buildDb(x => x
    .model<WithId>(
      'users',
      m => m.field('id'),
    )
    .model<WithId>(
      'posts',
      m => m.field('id'),
    )
  );

  await migrateDbUp(
    await compareSchemas(
      await adapter.migrator.fetchSchema(),
      current,
    ),
    adapter.migrator,
  );
})();
