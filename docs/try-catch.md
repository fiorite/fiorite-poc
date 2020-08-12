# TryCatch\<R>

`TryCatch<R>` wraps standard `try...catch` statements to catch error by its type.

It implements `Callable<R>` interface and can be called using `#[Symbol.invoke](): R` method.

```typescript
// fiorite.ts

import { tryCatch } from '@fiorite/core';

tryCatch(() => 1)[Symbol.invoke](); // 1

// standard.ts

try {
  return 1;
}
```

```typescript
// fiorite.ts

import { tryCatch } from '@fiorite/core';

tryCatch<number>(() => {
  throw new TypeError();
}).catch(TypeError, error => { // TypeError {}
  throw new RangeError();
}).catch(RangeError, () => {
  return 2;
}).finally(() => {
  console.log('done');
})[Symbol.invoke](); // 2

// standard.ts

try {
  throw new TypeError();
} catch (error1) {
  if (error1 instanceof TypeError) {
    try {
      throw new RangeError();
    } catch (error2) {
      if (error2 instanceof RangeError) {
        return 2
      }
    }
  }
  
  throw error1;
} finally {
  console.log('done');
}

```
