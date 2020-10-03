import { Channel, Connection } from 'amqplib';
import { Replies } from 'amqplib/properties';
import {
  AsyncCollection,
  CollectionIterator,
  CollectionSubject,
  NotImplementedError,
  proxyAsyncIterable
} from '@fiorite/core';
import { HttpContext } from '../../http/src';

export class RabbitQueue<M> extends AsyncCollection<M> {
  private _consumer: Promise<Replies.Consume>;

  constructor(private _channel: Channel, private _queue: string) {
    super();

    // _channel.

    // _channel.sendToQueue();
    // this._consumer = _channel.consume(_queue, message => {
    //   _channel.ack();
    // });
  }

  enqueue(message: M) {
    this._channel
    this._channel.sendToQueue(
      this._queue, Buffer.from(message),
    );

    return this;
  }

  [Symbol.asyncIterator]() {
    const iterator = new RabbitQueueIterator();

    (async () => {
      const consumer = await this._channel.consume(this._queue, message => {
        iterator.add(message);
      });

      await iterator.closes;
      await this._channel.cancel(consumer.consumerTag); // disable listening
    })();

    return iterator;
  }
}

class RabbitQueueIterator<M> extends CollectionIterator<M> { }
