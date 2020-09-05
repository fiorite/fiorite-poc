import { expect } from 'chai';

import { Provider, ServiceLifetime } from '../../../packages/core/di';

describe('Provider', () => {
  describe('constructor()', () => {
    it('should test constructor(Type) signature', () => {
      const provider = new Provider(Service);

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test constructor(object) signature', () => {
      const instance = new Service();
      const provider = new Provider(instance);

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(instance);
      expect(provider.factory).equals(null);
    });

    it('should test constructor(Type, ServiceLifetime) signature', () => {
      const provider = new Provider(Service, ServiceLifetime.Transient);

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test constructor(AbstractType, Type) signature', () => {
      const provider = new Provider(AbstractService, Service);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test constructor(AbstractType, Provide) signature', () => {
      const factory = () => new Service();
      const provider = new Provider(AbstractService, factory);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });

    it('should test constructor(AbstractType, object) signature', () => {
      const instance = new Service();
      const provider = new Provider(AbstractService, instance);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(instance);
      expect(provider.factory).equals(null);
    });

    it('should test constructor(AbstractType, Type, ServiceLifetime) signature', () => {
      const provider = new Provider(AbstractService, Service, ServiceLifetime.Transient);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test constructor(AbstractType, Provide, ServiceLifetime) signature', () => {
      const factory = () => new Service();
      const provider = new Provider(AbstractService, factory, ServiceLifetime.Transient);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });
  });

  describe('singleton()', () => {
    it('should test singleton(Type) signature', () => {
      const provider = Provider.singleton(Service);

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test singleton(object) signature', () => {
      const instance = new Service();
      const provider = Provider.singleton(instance);

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(instance);
      expect(provider.factory).equals(null);
    });

    it('should test singleton(AbstractType, Type) signature', () => {
      const provider = Provider.singleton(AbstractService, Service);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test singleton(AbstractType, Provide) signature', () => {
      const factory = () => new Service();
      const provider = Provider.singleton(AbstractService, factory);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });

    it('should test singleton(AbstractType, object) signature', () => {
      const instance = new Service();
      const provider = Provider.singleton(AbstractService, instance);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(instance);
      expect(provider.factory).equals(null);
    });
  });

  describe('scoped()', () => {
    it('should test scoped(Type) signature', () => {
      const provider = Provider.scoped(Service);

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Scoped);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test scoped(AbstractType, Type) signature', () => {
      const provider = Provider.scoped(AbstractService, Service);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Scoped);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test scoped(AbstractType, Provide) signature', () => {
      const factory = () => new Service();
      const provider = Provider.scoped(AbstractService, factory);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Scoped);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });
  });

  describe('transient()', () => {
    it('should test transient(Type) signature', () => {
      const provider = Provider.transient(Service);

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test transient(AbstractType, Type) signature', () => {
      const provider = Provider.transient(AbstractService, Service);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test transient(AbstractType, Provide) signature', () => {
      const factory = () => new Service();
      const provider = Provider.transient(AbstractService, factory);

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });
  });
});

class Service { }
abstract class AbstractService { }
