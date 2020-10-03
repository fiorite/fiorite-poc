import { DbBuilder } from '@fiorite/db';
import { collect, createAsyncIterable } from '../packages/core/collections';
import { cached } from 'sqlite3';

interface Person {
  id: string;
  name: string;
  age: number;
}

(async () => {
  // collect.interval(200);

  const abc = collect([1, 2, 3]);

  abc.;


  abc.repeatUntil(
    abc.take(1).listen(),
  ).listen();

  const db = new DbBuilder();

  db.add<Person>('name', model => {
    return model.add(field => {

    });
  });
});
