/**
 * Uses for Module Augmentation.
 *
 * @example ```typescript
 * // custom.ts
 *
 * export class Custom { }
 *
 * // custom_extension.ts
 *
 * import { Injector } from '@fiorite/core/injector';
 *
 * declare module '@fiorite/core/injector' {
 *   interface Injector {
 *     getCustom(): Custom;
 *   }
 * }
 *
 * Injector.prototype.addCustom = function(this: Injector) {
 *   return this.get(Custom);
 * }
 *
 * // main.ts
 *
 * import './custom_extension.ts';
 *
 * import { Injector, ProviderCollection, Startup } from '@fiorite/core';
 *
 * class Application implements Startup {
 *   configure(providers: ProviderCollection) {
 *     providers.addCustom();
 *   }
 *
 *   start(injector: Injector) {
 *     const custom = injector.getCustom();
 *   }
 * }
 * ```
 */

export { Injector } from './di/injector';

/**
 * Uses for Module Augmentation.
 *
 * @example ```typescript
 * // custom_extension.ts
 *
 * import { ProviderCollection } from '@fiorite/core/provider_collection';
 *
 * declare module '@fiorite/core/provider_collection' {
 *   interface ProviderCollection {
 *     addCustom(): this;
 *   }
 * }
 *
 * ProviderCollection.prototype.addCustom = function(this: ProviderCollection) {
 *   // Implementation here.
 *
 *   return this;
 * }
 *
 * // main.ts
 *
 * import './custom_extension.ts';
 *
 * import { ProviderCollection, Module } from '@fiorite/core';
 *
 * class CustomModule implements Module {
 *   configure(providers: ProviderCollection) {
 *     providers.addCustom();
 *   }
 * }
 * ```
 */

export { ProviderCollection } from './di/provider_collection';
