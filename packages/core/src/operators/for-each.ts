import { IndexedAsyncConsumer, IndexedConsumer } from '../consumer';

/**
 * Performs the {@param consumer} for each element in an {@param iterable}.
 *
 * @param iterable
 * @param consumer
 */
export function forEach<E>(iterable: Iterable<E>, consumer: IndexedConsumer<E>): void {
  if (Array.isArray(iterable)) {
    return iterable.forEach(consumer);
  }

  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();
  let index = 0;

  while (!result.done) {
    consumer(result.value, index);
    result = iterator.next();
    index++;
  }
}

/**
 * Performs the {@param consumer} for each element in an {@param iterable}.
 *
 * @param iterable
 * @param consumer
 */
export async function forEachAsync<E>(iterable: AsyncIterable<E>, consumer: IndexedAsyncConsumer<E>): Promise<void> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();
  let index = 0;

  while (!result.done) {
    await consumer(result.value, index);
    result = await iterator.next();
    index++;
  }
}
