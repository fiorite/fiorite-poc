export interface DbQuery {
  /**
   * Query target. E.g. table name, collection name, etc.
   */
  target: string;

  /**
   * Take number of elements. E.g OFFSET.
   */
  take: number | null;

  /**
   * Skip number of elements. E.g OFFSET.
   */
  skip: number | null;
}
