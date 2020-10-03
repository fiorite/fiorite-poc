import { NotImplementedError } from '../../errors';
import { proxyAsyncIterator } from './async_iterator_proxy';

export const defaultAsyncIterable: AsyncIterable<never> = proxyAsyncIterator(() => {
  throw new NotImplementedError();
});
