declare global {
  interface SymbolConstructor {
    /**
     * Symbol that {@link Disposable} uses as method name.
     */
    readonly dispose: symbol;
  }
}

(Symbol as any).dispose = Symbol.for('dispose');

export { };
