/**
 * @deprecated experimental
 */
export interface TreeNode<T> extends Iterable<TreeNode<T>> {
  data: T | null;
}
