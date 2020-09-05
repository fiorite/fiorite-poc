declare global {
  interface SymbolConstructor {
    /**
     * Symbol that {@link Equatable} uses as method name.
     */
    readonly equals: symbol;
  }
}

(Symbol as any).equals = Symbol.for('equals');

export { };
