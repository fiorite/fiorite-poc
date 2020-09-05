// import { DefaultInjector, Injector } from './injector';
// import { InjectorKey } from './key';
// import { HashMap, Queue } from '../collections';
// import { Disposable } from '../common'
//
// export class InjectorScope extends Injector implements Disposable {
//   private _injector: Injector;
//
//   get injector(): Injector {
//     return this._injector;
//   }
//
//   private _scoped = new HashMap<InjectorKey, unknown>();
//   private _disposables = new Queue<Disposable>();
//   private _disposed = false;
//
//   constructor(injector: Injector) {
//     super();
//     this._injector = injector;
//   }
//
//   get<T>(key: InjectorKey<T>): T {
//     if (this._scoped.has(key)) {
//       return this._scoped.get(key) as T;
//     }
//
//     const instance = this.injector.get(key);
//
//     // And not singleton
//     if (Disposable.implemented(instance)) {
//       this._disposables.enqueue(
//         Disposable.cast(instance),
//       );
//     }
//
//     // TODO: Add scoped check.
//     if (true) {
//       this._scoped.add(key, instance);
//     }
//
//     return instance as T;
//   }
//
//   has(key: InjectorKey): boolean {
//     return this.injector.has(key);
//   }
//
//   [Symbol.dispose]() {
//     const queue = this._disposables;
//
//     while(!queue.empty) {
//       queue.dequeue()[Symbol.dispose]();
//     }
//
//     this._scoped.clear();
//
//     this._disposed = true;
//   }
// }
