import { collect } from '@fiorite/core';

interface Person {
  id: string;
  name: string;
  age: number;
}

(async () => {
  // collect.interval(200);

  const abc = collect([1, 2, 3]);

  abc.listen();

  //
  // const db = new DbBuilder();
  //
  // db.add<Person>('name', model => {
  //   return model.add(field => {
  //
  //   });
  // });
});
