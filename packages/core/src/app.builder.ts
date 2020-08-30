import { Type } from './common';
import { Module } from './module';
import { HashSet } from './collections';
import { forEachSync } from '@fiorite/core/operators';

export class ApplicationBuilder {
  modules = new HashSet<Type<Module>>();

  add(module: Type<Module>): this {
    this.modules.add(module);

    return this;
  }

  addAll(iterable: Iterable<Type<Module>>): this {
    forEachSync<Type<Module>>(module => this.add(module))(iterable);

    return this;
  }
}
