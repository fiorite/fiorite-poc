import { DbField } from './db_field';

// export class DbModel<T = unknown> {
//   constructor(
//     readonly name: string,
//     readonly fields: readonly DbField[] = [],
//   ) { }
// }

export interface DbModel<T = unknown> {
  /**
   * Name of the model.
   */
  readonly name: string;
  readonly fields: readonly DbField<T extends object ? keyof T : string>[];
}
