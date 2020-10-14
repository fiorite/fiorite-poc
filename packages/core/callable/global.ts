declare global {
  interface SymbolConstructor {
    /**
     * Symbol that {@link Callable} uses as method name.
     *
     * @deprecated Constructor applies strategy for call.
     */
    readonly invoke: symbol;
  }
}

(Symbol as any).invoke = Symbol.for('Symbol.invoke');

export { };
