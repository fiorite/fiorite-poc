declare global {
  interface SymbolConstructor {
    /**
     * Symbol that {@link Cloneable} uses as method name.
     */
    readonly clone: symbol;
  }
}

(Symbol as any).clone = Symbol.for('clone');

export { };
