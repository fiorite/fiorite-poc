import { collect } from '@fiorite/core';
import { RabbitQueue } from '../packages/mq/rabbit/rabbit_queue';
import { connect } from 'amqplib';

interface Person {
  id: string;
  name: string;
  age: number;
}

(async () => {
  const items = collect([1, 2, 3])
    .append(1, 2, 3)
    .concat([1, 2, 3]);
  
  console.log(items);
  items.forEach(console.log);

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

  //
  // const db = new DbBuilder();
  //
  // db.add<Person>('name', model => {
  //   return model.add(field => {
  //
  //   });
  // });
})();
