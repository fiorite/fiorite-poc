import { DbCollection, DbContext } from '@fiorite/db';
import { wire } from '@fiorite/core';

import { Hero } from './model';
import { AsyncCollection } from '@fiorite/core/collections';

// Make class injectable.
@wire class HeroCollection extends AsyncCollection<Hero> {
  private readonly collection: DbCollection<Hero>;

  constructor(context: DbContext) {
    super();
    this.collection = context.collect('heroes');
  }

  [Symbol.asyncIterator](): AsyncIterator<Hero> {
    return this.collection[Symbol.asyncIterator]();
  }
}

export { HeroCollection };
