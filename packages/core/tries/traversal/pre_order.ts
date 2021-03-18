import { reverse } from '../../operators';
import { Stack } from '../../collections';
import { TreeNode } from '../node';

/**
 * @deprecated experimental
 */
export function* traversePreOrder<T>(rootNode: TreeNode<T>): Iterable<T | null> {
  const stack = new Stack([rootNode]);

  while (!stack.empty) {
    const node = stack.pop();

    yield node.data;

    stack.pushAll(
      reverse<TreeNode<T>>()(node),
    );
  }
}
