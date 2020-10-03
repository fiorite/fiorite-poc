import { Channel } from 'amqplib';
import { AsyncCollection, CollectionIterator } from '@fiorite/core';
import { Message } from '../message';

// todo: add operator auto-close that should encapsulate logic.
export class RabbitQueue extends AsyncCollection<Message<Buffer>> {
  // todo: add serializer
  constructor(private _channel: Channel, private _queue = '') {
    super(() => {
      const iterator = new RabbitQueueIterator<Buffer>();

      (async () => {
        const consumer = await this._channel.consume(this._queue, message => {
          if (null !== message) {
            const wrapped = new Message(
              message.content,
              () => this._channel.ack(message), // todo: if auto acknowledge
              () => this._channel.nack(message), // todo: if auto acknowledge
            );

            iterator.add(wrapped); // todo: use this._channel.nack() whether listener closes
          }
        });

        await iterator.closes;
        await this._channel.cancel(consumer.consumerTag); // disable listening
      })();

      return iterator;
    });
  }

  enqueue(content: Buffer) {
    this._channel.sendToQueue(this._queue, content);

    return this;
  }

  dequeue() {
    return this.first();
  }
}

class RabbitQueueIterator<TContent> extends CollectionIterator<Message<TContent>> { }
