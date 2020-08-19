export class HttpDate {
  private constructor() { }

  static parse(value: string): Date {
    return new Date(Date.parse(value));
  }

  static stringify(date: Date): string {
    return date.toUTCString();
  };
}
