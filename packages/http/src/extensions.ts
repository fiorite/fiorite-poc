import { InjectorBuilder  } from '@fiorite/core';

declare module '@fiorite/core' {
  interface InjectorBuilder {
    addCors<T>(): InjectorBuilder;
  }
}

InjectorBuilder.prototype.addCors = function (this: InjectorBuilder) {
  throw new Error('Not implemented');
}

