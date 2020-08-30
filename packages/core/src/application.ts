import { ProviderCollection } from './di';
import { Type } from './common';
import { Module } from './module';
import { forEachSync } from './operators';

/**
 * Add injector facade (contract).
 */
export class AppBuilder {
  readonly providers = new ProviderCollection();
  private _buffer: Type<Module>[] = [];

  get buffer(): readonly Type<Module>[] {
    return this._buffer;
  }

  add(module: Type<Module>): this {
    this._buffer.push(module);

    return this;
  }

  addAll(iterable: Iterable<Type<Module>>): this {
    forEachSync<Type<Module>>(module => this.add(module))(iterable);

    return this;
  }
}
