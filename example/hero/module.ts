import { Module, ProviderCollection } from '@fiorite/core';

import { HeroCollection } from './collection';

export class HeroModule implements Module {
  configure(providers: ProviderCollection) {
    providers.add(HeroCollection);
  }
}
