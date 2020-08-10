import { HashMap } from './hash.map';
import { InjectorBuilder } from './injector.builder';
import { Selector } from './selector';
import { Disposable } from './disposable';
import { Collection } from './collection';

export type InjectorToken = unknown;

export class Injector extends Collection<unknown> implements Disposable {
  static build(selector: Selector<InjectorBuilder>): Injector {
    const builder = new InjectorBuilder();
    return selector(builder).build();
  }

  readonly providers = new HashMap<InjectorToken, unknown>();

  get<T>(token: InjectorToken): T {
    return this.providers.get(token) as T;
  }

  [Symbol.dispose](): void {
    this.filter((x: any) => typeof x[Symbol.dispose] === 'function')
      .forEach((x: any) => x[Symbol.dispose]());
  }

  [Symbol.iterator](): Iterator<unknown> {
    return this.providers[Symbol.iterator]();
  }
}
