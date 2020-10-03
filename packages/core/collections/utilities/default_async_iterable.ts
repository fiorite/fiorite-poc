import { NotImplementedError } from '../../errors';
import { proxyAsyncIterable } from './async_iterable_proxy';

export const defaultAsyncIterable: AsyncIterable<never> = proxyAsyncIterable(() => {
  throw new NotImplementedError();
});
