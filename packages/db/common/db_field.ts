export enum DbFieldType {
  String = 'string',
}

export interface DbField {
  name: string;
  type: DbFieldType | string;
}
