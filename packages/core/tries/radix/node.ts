import { TreeNode } from '@fiorite/core/tries/node';
import { getIterator } from '@fiorite/core';

/**
 * @deprecated experimental
 */
export class RadixTreeNode<T> implements TreeNode<T> {
  constructor(
    public path: string,
    public data: T | null = null,
    readonly children: RadixTreeNode<T>[] = [],
  ) { }

  [Symbol.iterator]() {
    return getIterator(this.children);
  }
}
