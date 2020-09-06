import { Selector, Type } from '../other/common';
import { DateNormalizer } from './normalizers/date';

export interface Encoder {
  encode<T>(value: T): string;
  decode<T>(value: string): T;
}

export interface Normalizer<T, R> {
  normalize(value: T): R;
}

export class JsonEncoder implements Encoder {
  /**
   * Default instance of {@link JsonEncoder}.
   */
  static readonly default = new JsonEncoder();

  /**
   * Converts the value of a specified type into a JSON string.
   *
   * @param value
   */
  static encode<T>(value: T): string {
    return this.default.encode(value);
  }

  /**
   * Parses the UTF-8 encoded text representing a single JSON value into an instance of a specified type.
   *
   * @param value
   */
  static decode<T>(value: string): T {
    return this.default.decode(value) as T;
  }

  /**
   * @private Use {@link JsonEncoder.default} instead.
   */
  private constructor() { }

  /**
   * Parses the UTF-8 encoded text representing a single JSON value into an instance of a specified type.
   *
   * @param value
   */
  decode<T>(value: string): T {
    return JSON.parse(value);
  }

  /**
   * Converts the value of a specified type into a JSON string.
   *
   * @param value
   */
  encode<T>(value: T): string {
    return JSON.stringify(value);
  }
}

export class Serializer {
  static readonly default = new Serializer(JsonEncoder.default);

  /**
   * @param encoder
   * @param normalizers
   */
  constructor(readonly encoder: Encoder, readonly normalizers: Normalizer<unknown, unknown>[] = [DateNormalizer.default]) { }

  /**
   * TODO: Investigate the best way to serialize/deserialize objects.
   *
   * @param value
   * @param normalizer
   */
  serialize<T, R>(value: T, normalizer?: Type<T> | Selector<T, R> | Normalizer<T, R>): string {
    let normalize: Selector<T, R>;
    let normalizable: Normalizable<R>;

    // const type = Type.of(normalizer);

    if (Type.is('undefined', normalizer)) {
      normalizable = value as unknown as Normalizable<R>;

      if (typeof normalizable[Symbol.normalize] === 'function') {
        normalize = () => normalizable[Symbol.normalize]();
      } else {
        if (typeof normalizable.constructor === 'function') {
          // TODO: Find type in registry
        }

        normalize = (() => value) as unknown as Selector<T, R>;
      }
    } else if (Type.is('function', normalizer)) {
      normalize = normalizer as Selector<T, R>;
    } else if (Type.is('class', normalizer)) {
      const prototype = (normalizer as unknown as Type<Normalizable>).prototype;

      normalize = (
        typeof prototype[Symbol.normalize] === 'function' ?
          () => prototype[Symbol.normalize].call(value) :
          () => value // TODO: Find in registry.
      ) as Selector<T, R>;
    } else if (Type.is('object', normalizer)) {
      normalize = (normalizer as Normalizer<T, R>).normalize.bind(normalizer);
    } else {
      throw new RangeError('Unsupported normalizer type');
    }

    const normalized = normalize(value);

    return this.encoder.encode(normalized);
  }

  /**
   * @param value
   * @param type
   */
  deserialize<T>(value: string, type: Type<T>): T {
    return this.encoder.decode(value);
  }
}

export const serialize = Serializer.default.serialize.bind(Serializer.default);

export interface Normalizable<T = unknown> {
  [Symbol.normalize](): T;
}
