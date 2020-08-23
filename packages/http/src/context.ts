import { AbstractType, Disposable, Injector, Provider, ServiceKey } from '@fiorite/core';

import { Request } from './request';
import { FeatureCollection } from './feature_collection';
import { Response } from './response';

export class HttpContext implements Disposable {
  get [Symbol.toStringTag]() {
    return 'HttpContext';
  }

  get request(): Request {
    return this.features.get(Request);
  }

  get response(): Response {
    return this.features.get(Response);
  }

  static from(request: Request, response: Response) {
    return new HttpContext(
      new FeatureCollection(
        [
          [Request, request],
          [Response, response],
        ]
      )
    );
  }

  constructor(readonly features: FeatureCollection) { }

  getFeature<T>(type: AbstractType<T>): T {
    return this.features.get(type) as T;
  }

  addFeature<T>(type: AbstractType<T>, feature: T): this {
    this.features.add(type, feature);

    return this;
  }

  async [Symbol.dispose]() {
    await Promise.all(this.features.values.map(Disposable.dispose));
  }
}
