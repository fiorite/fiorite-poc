import * as internal from '../internal';

export interface Assert {
  (condition: boolean): void;
}

export class Assert extends Function {
  static readonly default = new Assert();

  get enabled(): boolean {
    return this._enabled;
  }

  private _enabled = true;

  private constructor() {
    super();

    return new Proxy(this, {
      apply: (_, __, args: [boolean]) => this.select(() => args[0]),
    });
  }

  enable() {
    return this._enabled = true;
  }

  disable() {
    return this._enabled = false;
  }

  select(selector: () => boolean) {
    if (this.enabled && !selector()) {
      throw new TypeError('Assertion failed.');
    }
  }

  object(value: any) {
    return this.select(() => internal.isObject(value));
  }

  function(value: any) {
    return this.select(() => internal.isFunction(value));
  }

  notAsyncFunction(value: any) {
    return this.select(() => !internal.isAsyncFunction(value));
  }

  syncFunction(value: any) {
    return this.select(() => internal.isSyncFunction(value));
  }

  asyncFunction(value: any) {
    return this.select(() => internal.isAsyncFunction(value));
  }

  method(object: any, methodKey: string | symbol) {
    return this.select(() => internal.isMethod(object, methodKey));
  }

  syncMethod(object: any, methodKey: string | symbol) {
    return this.select(() => internal.isSyncMethod(object, methodKey));
  }

  asyncMethod(object: any, methodKey: string | symbol) {
    return this.select(() => internal.isAsyncMethod(object, methodKey));
  }

  iterable(value: any) {
    return this.select(() => internal.isIterable(value));
  }

  asyncIterable(value: any) {
    return this.select(() => internal.isAsyncIterable(value));
  }
}

export const assert = Assert.default;
