import { AsyncOperator, Operator } from './functional_types';

export interface Pipe extends Function {
  <E, R>(operator: Operator<E, R>): Operator<E, R>;

  <E, A, R>(
    operator1: Operator<E, Iterable<A>>,
    operator2: Operator<A, R>,
  ): Operator<E, R>;

  <E, A, B, R>(
    operator1: Operator<E, Iterable<A>>,
    operator2: Operator<A, Iterable<B>>,
    operator3: Operator<B, R>,
  ): Operator<E, R>;

  <E, A, B, C, R>(
    operator1: Operator<E, Iterable<A>>,
    operator2: Operator<A, Iterable<B>>,
    operator3: Operator<B, Iterable<C>>,
    operator4: Operator<C, R>,
  ): Operator<E, R>;

  <E, A, B, C, D, R>(
    operator1: Operator<E, Iterable<A>>,
    operator2: Operator<A, Iterable<B>>,
    operator3: Operator<B, Iterable<C>>,
    operator4: Operator<C, Iterable<D>>,
    operator5: Operator<D, R>,
  ): Operator<E, R>;
}

export const pipe: Pipe = function pipe(...operators: any[]): any {
  return (iterable: any) => {
    return operators.slice(1).reduce((x, operator) => {
      return operator(x);
    }, operators[0](iterable));
  }
}

export interface AsyncPipe extends Function {
  <E, R>(operator: AsyncOperator<E, R>): AsyncOperator<E, R>;

  <E, A, R>(
    operator1: AsyncOperator<E, AsyncIterable<A>>,
    operator2: AsyncOperator<A, R>,
  ): AsyncOperator<E, R>;

  <E, A, B, R>(
    operator1: AsyncOperator<E, AsyncIterable<A>>,
    operator2: AsyncOperator<A, AsyncIterable<B>>,
    operator3: AsyncOperator<B, R>,
  ): AsyncOperator<E, R>;

  <E, A, B, C, R>(
    operator1: AsyncOperator<E, AsyncIterable<A>>,
    operator2: AsyncOperator<A, AsyncIterable<B>>,
    operator3: AsyncOperator<B, AsyncIterable<C>>,
    operator4: AsyncOperator<C, R>,
  ): AsyncOperator<E, R>;

  <E, A, B, C, D, R>(
    operator1: AsyncOperator<E, AsyncIterable<A>>,
    operator2: AsyncOperator<A, AsyncIterable<B>>,
    operator3: AsyncOperator<B, AsyncIterable<C>>,
    operator4: AsyncOperator<C, AsyncIterable<D>>,
    operator5: AsyncOperator<D, R>,
  ): AsyncOperator<E, R>;
}

export const pipeAsync: AsyncPipe = function pipe(...operators: any[]): any {
  return (iterable: any) => {
    return operators.slice(1).reduce((x, operator) => {
      return operator(x);
    }, operators[0](iterable));
  }
}
