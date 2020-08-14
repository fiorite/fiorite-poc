import { Type, Callable } from './common';
import { HashMap } from './collections';

export type TryStatement<R> = () => R;
export type CatchStatement<E, R> = (error: E) => R;
export type FinallyStatement = () => void;

export class TryCatch<R> extends Callable<R> {
  private readonly _try: TryStatement<R>;
  private readonly _catch: HashMap<Type, CatchStatement<unknown, R>>;
  private _finally: FinallyStatement = () => void 0;

  constructor(statement: TryStatement<R>, _finally: FinallyStatement = () => void 0) {
    super();
    this._try = statement;
    this._catch = new HashMap<Type, CatchStatement<unknown, R>>();
    this._finally = _finally;
  }

  catch<E>(errorType: Type<E>): TryCatch<R | null>;
  catch<E>(errorType: Type<E>, statement: CatchStatement<E, R>): TryCatch<R>;
  catch(errorType: Type, statement: CatchStatement<unknown, unknown> = () => null): TryCatch<unknown> {
    this._catch.add(errorType, statement as CatchStatement<unknown, R>);

    return this;
  }

  finally(statement: () => void): this {
    this._finally = statement;

    return this;
  }

  [Symbol.invoke](): R {
    let returns: R;

    try {
      returns = this._try();
    } catch (error) {
      const iterator = this._catch[Symbol.iterator]();

      let caught = false;
      let result = iterator.next();

      while (!result.done) {
        const [type, statement] = result.value;

        if (error instanceof type) {
          try {
            returns = statement(error);
            caught = true;

            if (iterator.return) {
              iterator.return();
            }

            break;
          } catch (other) {
            error = other;
            caught = true;
          }
        }
      }

      if (!caught) {
        throw error;
      }
    } finally {
      this._finally();
    }

    return returns!;
  }
}


export function tryCatch<R>(statement: TryStatement<R>): TryCatch<R> {
  return new TryCatch(statement);
}
