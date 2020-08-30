import { PromiseOr } from '@fiorite/core';

/**
 * Interface to manage application execution.
 */
export class BootManager {
  static readonly global = new BootManager();

  private constructor() { }

  autostart = true;
  startup: (() => PromiseOr<void>) | null = null;

  setStartup(startup: () => void | Promise<void>) {
    if (null !== this.startup) {
      throw new Error('Unable to boot 2 application at once.');
    }

    this.startup = startup;

    if (this.autostart) {
      this.boot();
    }
  }

  enableAutostart() {
    this.autostart = true;
  }

  disableAutostart() {
    this.autostart = false;
  }

  async boot() {
    (await this.startup!)();
  }
}

export const bootManager = BootManager.global;
