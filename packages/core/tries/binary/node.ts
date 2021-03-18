import { TreeNode } from '../node';

/**
 * @deprecated experimental
 */
export class BinaryTreeNode<T> implements TreeNode<T> {
  constructor(
    readonly data: T | null = null,
    readonly left: BinaryTreeNode<T> | null = null,
    readonly right: BinaryTreeNode<T> | null = null,
  ) { }

  *[Symbol.iterator]() {
    if (null !== this.left) {
      yield this.left;
    }

    if (null !== this.right) {
      yield this.right;
    }
  }
}
