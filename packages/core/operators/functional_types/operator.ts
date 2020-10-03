export type Operator<E = unknown, R = Iterable<E>> = (iterable: Iterable<E>) => R;

export type AsyncOperator<E = unknown, R = AsyncIterable<E>> = (iterable: AsyncIterable<E>) => R;
