import { NotImplementedError } from '@fiorite/core';

import { proxyAsyncIterable } from './async_iterable_proxy';

export const defaultAsyncIterable: AsyncIterable<never> = proxyAsyncIterable(() => {
  throw new NotImplementedError();
});
