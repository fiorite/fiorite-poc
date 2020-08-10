declare global {
  interface SymbolConstructor {
    readonly normalize: symbol;
    readonly dispose: symbol;
  }
}

(Symbol as any).normalize = Symbol('normalize');
(Symbol as any).dispose = Symbol('dispose');

export { };
