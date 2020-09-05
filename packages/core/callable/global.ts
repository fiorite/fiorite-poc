declare global {
  interface SymbolConstructor {
    /**
     * Symbol that {@link Callable} uses as method name.
     */
    readonly invoke: symbol;
  }
}

(Symbol as any).invoke = Symbol.for('invoke');

export { };
