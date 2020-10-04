import { collect } from '@fiorite/core';
import { DbBuilder, DbSchema } from '@fiorite/db';
import { Database } from 'sqlite3';
import { join } from 'path';
import { SqliteDbAdapter } from '../packages/db/sqlite';
import { promisify } from 'util';

interface Person {
  id: string;
  name: string;
  age: number;
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

  const adapter = new SqliteDbAdapter(database);

  async function manageSchemas(actual: DbSchema, expected: DbSchema) {
    const buffer = expected.models.slice();

    for (const model of actual.models) {
      const index = buffer.findIndex(x => model.name === x.name); // todo: cs and ci.

      if (index > -1) {
        buffer.splice(index, 1);

        // change
        console.log('changes could be', model);
      } else {
        // delete
        // console.log('delete', model);
        await promisify(database.exec.bind(database))( // todo: delete table
          `DROP TABLE ${model.name};`,
        );
      }
    }

    for (const model of buffer) {
      const fields = model.fields.map(field => {
        return `${field.name} TEXT`;
      }).join(', ');

      await promisify(database.exec.bind(database))( // todo: create table
        `CREATE TABLE IF NOT EXISTS ${model.name} (${fields})`,
      );
    }
  }

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

  await manageSchemas(
    await adapter.schema(),
    new DbBuilder()
      .add('users', model => {
        model.add('id');
      })
      .add('posts', model => {
        model.add('id');
      })
      .build(),
  );
})();
