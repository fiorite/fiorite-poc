import { HashMap } from '@fiorite/core/collections';
import { AbstractType } from '@fiorite/core';

import { Feature } from './feature';

export class FeatureCollection extends HashMap<AbstractType<Feature>, Feature> {
  get<T>(type: AbstractType<T>): T {
    return super.get(type) as T;
  }
}
