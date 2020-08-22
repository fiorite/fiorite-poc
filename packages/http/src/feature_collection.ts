import { AbstractType, HashMap } from '@fiorite/core';
import { Feature } from './feature';

export class FeatureCollection extends HashMap<AbstractType<Feature>, Feature> {
  get<T>(type: AbstractType<T>): T {
    return super.get(type) as T;
  }
}
