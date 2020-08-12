declare global {
  interface SymbolConstructor {
    readonly normalize: symbol;
    readonly dispose: symbol;
    readonly clone: symbol;
    readonly equals: symbol;
    readonly invoke: symbol;
  }
}

(Symbol as any).normalize = Symbol('normalize');
(Symbol as any).dispose = Symbol('dispose');
(Symbol as any).clone = Symbol('clone');
(Symbol as any).equals = Symbol('equals');
(Symbol as any).invoke = Symbol('invoke');

export { };
