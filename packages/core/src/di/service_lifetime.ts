import { Equatable } from '../common';

export class ServiceLifetime implements Equatable {
  /**
   * Providers string tag of an instance.
   */
  get [Symbol.toStringTag](): string {
    return 'ServiceLifetime';
  }

  /**
   * Pre-defined lifetime.
   */
  static readonly Transient = new ServiceLifetime(0);

  /**
   * Pre-defined lifetime.
   */
  static readonly Singleton = new ServiceLifetime(1);

  /**
   * Pre-defined lifetime.
   */
  static readonly Scoped = new ServiceLifetime(2);

  /**
   * Returns whether lifetime is {@link ServiceLifetime.Transient}.
   */
  get isTransient(): boolean {
    return ServiceLifetime.Transient.value === this.value;
  }

  /**
   * Returns whether lifetime is {@link ServiceLifetime.Singleton}.
   */
  get isSingleton(): boolean {
    return ServiceLifetime.Singleton.value === this.value;
  }

  /**
   * Checks whether lifetime is {@link ServiceLifetime.Scoped}.
   */
  get isScoped(): boolean {
    return ServiceLifetime.Scoped.value === this.value;
  }

  private constructor(readonly value: number) { }

  [Symbol.equals](other: unknown): boolean {
    return other instanceof ServiceLifetime &&
      other.value === this.value;
  }
}

