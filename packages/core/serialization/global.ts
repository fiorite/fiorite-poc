declare global {
  interface SymbolConstructor {
    /**
     * TODO: Describe.
     */
    readonly normalize: symbol;
  }
}

(Symbol as any).equals = Symbol.for('normalize');

export { };
