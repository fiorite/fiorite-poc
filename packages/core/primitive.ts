export type primitive = boolean | number | string | symbol;

export interface Primitive {
  valueOf(): primitive;
}
