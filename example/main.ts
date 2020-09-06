import { DbBuilder } from '@fiorite/db';

interface Person {
  id: string;
  name: string;
  age: number;
}

(async () => {
  const db = new DbBuilder();

  db.add<Person>('name', model => {
    return model.add(field => {

    });
  });
});
