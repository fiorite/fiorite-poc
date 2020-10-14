import { collect } from '@fiorite/core';

// working file

(async () => {
  collect([1, 2, 3])
    .listen(console.log);
})();
