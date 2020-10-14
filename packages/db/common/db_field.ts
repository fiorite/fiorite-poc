export enum DbFieldType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
}

export interface DbField<N = string> {
  name: N;

  /**
   * @default `'string'`
   */
  type?: 'string' | 'number' | 'boolean' | string;
}
