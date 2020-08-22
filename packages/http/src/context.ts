import { AbstractType, Disposable, HashMap, Injector, ProviderDescriptor, ServiceKey } from '@fiorite/core';

import { Request } from './request';
import { WritableResponse } from './writable_response';
import { FeatureCollection } from './feature_collection';

export class HttpContext implements Disposable {
  get [Symbol.toStringTag]() {
    return 'HttpContext';
  }

  get request(): Request {
    return this.features.get(Request);
  }

  get response(): WritableResponse {
    return this.features.get(WritableResponse);
  }

  get services(): Injector {
    return this.features.get(Injector);
  }

  constructor(readonly features: FeatureCollection) { }

  getFeature<T>(type: AbstractType<T>): T {
    return this.features.get(type) as T;
  }

  addFeature<T>(type: AbstractType<T>, feature: T): this {
    this.features.add(type, feature);

    return this;
  }

  getService<T>(type: ServiceKey<T> | ProviderDescriptor<T>): T {
    return this.services.get(type);
  }

  async [Symbol.dispose]() {
    await Promise.all(this.features.values.map(Disposable.dispose));
  }
}
