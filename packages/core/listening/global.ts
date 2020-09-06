declare global {
  interface SymbolConstructor {
    /**
     * Symbol that {@link Closeable} uses as method name.
     */
    readonly close: symbol;
  }
}

(Symbol as any).close = Symbol.for('close');

export { };
