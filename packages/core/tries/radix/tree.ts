import { RadixTreeNode } from './node';
import { Collection, InvalidOperationError, Queue } from '../../collections';
import { Tree } from '../tree';

/**
 * todo: decide whether it could be compatible with hash map or rootNode.
 * @deprecated experimental
 *
 */
export class RadixTree<T> extends Collection<[string, T]> implements Tree<T> {
  readonly rootNode: RadixTreeNode<T>;

  constructor() {
    super();
    this.rootNode = new RadixTreeNode<T>('');
  }

  add(path: string, data: T): this {
    if (null === data) {
      throw new TypeError('Data shouldn\'t equal null');
    }

    let node = this.rootNode;

    loop:
      while (node) {
        path = path.substr(node.path.length);

        if (!path.length) {
          if (node.data) {
            throw new TypeError('Payload already defined');
          }

          node.data = data;

          return this;
        }

        if (node.children.length) {
          for (const child of node.children) {
            if (child.path[0] === path[0]) {
              let i;

              for (i = 0; i < Math.min(child.path.length, path.length); i++) {
                if (path[i] !== child.path[i]) {
                  break;
                }
              }

              if (i >= child.path.length) { // go further down the tree
                node = child;
                continue loop;
              } else if (i >= path.length) { // we inject a new rootNode, cause the new path is part of this one
                const edge = new RadixTreeNode<T>(path, data);

                child.path = child.path.substr(path.length);

                node.children.splice(
                  node.children.indexOf(child), 1
                );

                edge.children.push(child);
                node.children.push(edge);

                return this;
              } else if (i > 0) { // we match partly, generate a new edge
                const edge = new RadixTreeNode<T>(
                  path.substr(0, i)
                );

                child.path = child.path.substr(i);

                node.children.splice(
                  node.children.indexOf(child), 1
                );

                node.children.push(edge);
                edge.children.push(child);

                node = edge;
                continue loop;
              }
            }
          }
        }

        node.children.push(
          new RadixTreeNode(
            path,
            data,
            [],
          ),
        );

        return this;
      }

    return this;
  }

  delete(path: string): this {
    let node = this.rootNode; // todo: fix compatibility
    let offset = node.path.length;

    const length = path.length;
    const buffer = [];

    loop:
      while (node) {
        buffer.push(node);

        if (length === offset) {
          break;
        }

        if (!node.children.length) {
          return this;
        }

        for (const child of node.children) {
          if ( path[offset] === child.path[0] && path.indexOf(child.path, offset) === offset ) {
            node = child;
            offset += node.path.length;
            continue loop;
          }
        }
      }

    buffer.reverse();
    node = buffer[0];
    const parent = buffer[1];

    switch (node.children.length) {
      case 0:
        parent.children.splice(
          parent.children.indexOf(node), 1
        );
        break;
      case 1:
        const child = node.children[0];
        child.path = node.path + child.path;

        parent.children.splice(
          parent.children.indexOf(node), 1
        );

        parent.children.push(child);
        break;
    }

    return this;
  }

  get(path: string): T {
    let node = this.rootNode;

    let offset = node.path.length;
    const length = path.length;

    loop:
      while(node) {
        if (length === offset) {
          if (null === node.data) {
            throw new InvalidOperationError();
          }

          return node.data!;
        }

        if (!node.children.length) {
          break;
        }

        for (const child of node.children) {
          if ( path[offset] === child.path[0] && path.indexOf(child.path, offset) === offset ) {
            node = child;
            offset += node.path.length;
            continue loop;
          }
        }

        break;
      }

    throw new InvalidOperationError();
  }

  tryGet(path: string): T | null;
  tryGet(path: string, or: T): T;
  tryGet(path: string, or: T | null = null) {
    try {
      return this.get(path);
    } catch (error) {
      if (error instanceof InvalidOperationError) {
        return or;
      }

      throw error;
    }
  }

  clear(): this {
    this.rootNode.children.splice(0, this.rootNode.children.length);

    return this;
  }

  *[Symbol.iterator]() {
    const queue = new Queue<[string, RadixTreeNode<T>]>([
      ['', this.rootNode]
    ]);

    while (!queue.empty) {
      const [prefix, node] = queue.dequeue();
      const value = prefix + node.path;

      if (node.children) {
        for (const child of node.children) {
          queue.enqueue([value, child]);
        }
      }

      if (null !== node.data) {
        yield [value, node.data] as [string, T];
      }
    }
  }
}
