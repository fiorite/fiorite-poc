/**
 * Describes arguments types and return type.
 *
 * @deprecated Experimental feature.
 */
export interface Callable<C extends (...args: any) => any> extends Function {
  (...args: Parameters<C>): ReturnType<C>;
}

/**
 * Abstraction that allows to implement {@link Function} class.
 * It's useful whether you want to store state of the function.
 *
 * Be careful extending current class in case its type would be `function`, not `object`.
 *
 * @deprecated Experimental feature.
 *
 * @example ```typescript
 * import { Callable } from '@fiorite/core';
 *
 * type StringGetter = Getter<string>;
 *
 * function logMessage(getter: StringGetter) {
 *   console.log(getter());
 * }
 *
 * class Instance extends Callable<StringGetter> {
 *   constructor() {
 *     super(() => 'Hello from instance!');
 *   }
 * }
 *
 * logMessage(() => 'Hello from function!'); // 'Hello from function!'
 * logMessage(new Instance()); // logs 'Hello from instance!'
 *
 * ```
 */
export abstract class Callable<C extends (...args: any) => any> extends Function {
  protected constructor(caller: (...args: Parameters<C>) => ReturnType<C>) {
    super();

    return new Proxy(this, {
      apply(target, _, args: Parameters<C>) {
        return caller(...args);
      },
    });
  }
}
