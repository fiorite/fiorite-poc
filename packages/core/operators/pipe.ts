import { AsyncOperator, Operator } from './operator';
import { CombinedOperator } from './combine';

export interface Pipe extends Function {
  // 1

  <E, R>(
    operator: Operator<E, R>
  ): Operator<E, R>;

  <E, R>(
    operator: AsyncOperator<E, R>
  ): AsyncOperator<E, R>;

  <E, S, A>(
    operator: CombinedOperator<E, S, A>,
  ): CombinedOperator<E, S, A>;

  // 2

  <E, A, R>(
    operator1: Operator<E, Iterable<A>>,
    operator2: Operator<A, R>,
  ): Operator<E, R>;

  <E, A, R>(
    operator1: Operator<E, AsyncIterable<A>>,
    operator2: AsyncOperator<A, R>,
  ): Operator<E, R>;

  <E, A, R>(
    operator1: AsyncOperator<E, AsyncIterable<A>>,
    operator2: AsyncOperator<A, R>,
  ): AsyncOperator<E, R>;

  // 3

  <E, A, B, R>(
    operator1: Operator<E, Iterable<A>>,
    operator2: Operator<A, Iterable<B>>,
    operator3: Operator<B, R>
  ): Operator<E, R>;

  <E, A, B, R>(
    operator1: Operator<E, Iterable<A>>,
    operator2: Operator<A, AsyncIterable<B>>,
    operator3: AsyncOperator<B, R>
  ): Operator<E, R>;

  <E, A, B, R>(
    operator1: Operator<E, AsyncIterable<A>>,
    operator2: AsyncOperator<A, AsyncIterable<B>>,
    operator3: AsyncOperator<B, R>
  ): Operator<E, R>;

  <E, A, B, R>(
    operator1: AsyncOperator<E, AsyncIterable<A>>,
    operator2: AsyncOperator<A, AsyncIterable<B>>,
    operator3: AsyncOperator<B, R>
  ): AsyncOperator<E, R>;
}

// export type Pipeline = Function & SyncPipeline & AsyncPipeline;

export const pipe: Pipe = function pipe(...operators: any[]): any {
  return (iterable: any) => {
    return operators.slice(1).reduce((x, operator) => {
      return operator(x);
    }, operators[0](iterable));
  }
}
