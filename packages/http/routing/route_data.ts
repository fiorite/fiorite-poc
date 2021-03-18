export class RouteData {
  readonly [key: string]: unknown;

  constructor(object: Record<string, unknown>) {
    Object.assign(this, { ...object });
  }
}
