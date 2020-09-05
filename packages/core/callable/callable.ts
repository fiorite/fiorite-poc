/**
 * Describes arguments types and return type.
 */
export interface Callable<TFunction extends (...args: any) => any> extends Function {
  (...args: Parameters<TFunction>): ReturnType<TFunction>;
}

/**
 * Abstraction that allows to
 *
 * Be careful extending current class in case its type would be `function`, not `object`.
 *
 * @example ```typescript
 * import { Callable } from '@fiorite/core';
 *
 * function log(getter: () => string) {
 *   console.log(getter());
 * }
 *
 * class Message extends Callable<() => string> {
 *   [Symbol.invoke](): string {
 *     return 'Hello world!';
 *   }
 * }
 *
 * log(new Message()); // logs "Hello world!"
 *
 * ```
 */
export abstract class Callable<TFunction extends (...args: any) => any> extends Function {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor() {
    super();

    return new Proxy(this, {
      apply(target, _, args: Parameters<TFunction>) {
        return target[Symbol.invoke](...args);
      },
    });
  }

  /**
   * Handles call on instance.
   */
  abstract [Symbol.invoke](...args: Parameters<TFunction>): ReturnType<TFunction>;
}
