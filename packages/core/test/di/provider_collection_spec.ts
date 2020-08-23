import { expect } from 'chai';

import { Provider, ProviderCollection, ServiceLifetime } from '../../src';

describe('ProviderCollection', () => {
  let providers: ProviderCollection;

  beforeEach(() => providers = new ProviderCollection());

  describe('#add()', () => {
    it('should test #add(Provider) signature', () => {
      const provider = new Provider(Service);

      providers.add(provider);

      expect(providers.first()).equals(provider);
    });

    describe('#add(ProviderTuple)', () => {
      it('should test #add([Type]) signature', () => {
        const provider = providers.add([Service]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #add([Type, ServiceLifetime]) signature', () => {
        const provider = providers.add([Service, ServiceLifetime.Transient]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #add([AbstractType, Type]) signature', () => {
        const provider = providers.add([AbstractService, Service]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #add([AbstractType, Provide]) signature', () => {
        const factory = () => new Service();
        const provider = providers.add([AbstractService, factory]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });

      it('should test #add([AbstractType, object]) signature', () => {
        const instance = new Service();
        const provider = providers.add([AbstractService, instance]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(instance);
        expect(provider.factory).equals(null);
      });

      it('should test #add([AbstractType, Type, ServiceLifetime]) signature', () => {
        const provider = providers.add([AbstractService, Service, ServiceLifetime.Transient]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #add([AbstractType, Provide, ServiceLifetime]) signature', () => {
        const factory = () => new Service();
        const provider = providers.add([AbstractService, factory, ServiceLifetime.Transient]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });
    });

    it('should test #add(Type) signature', () => {
      const provider = providers.add(Service).first();

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #add(Type, ServiceLifetime) signature', () => {
      const provider = providers.add(Service, ServiceLifetime.Transient).first();

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #add(AbstractType, Type) signature', () => {
      const provider = providers.add(AbstractService, Service).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #add(AbstractType, Provide) signature', () => {
      const factory = () => new Service();
      const provider = providers.add(AbstractService, factory).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });

    it('should test #add(AbstractType, object) signature', () => {
      const instance = new Service();
      const provider = providers.add(AbstractService, instance).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(instance);
      expect(provider.factory).equals(null);
    });

    it('should test #add(AbstractType, Type, ServiceLifetime) signature', () => {
      const provider = providers.add(AbstractService, Service, ServiceLifetime.Transient).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #add(AbstractType, Provide, ServiceLifetime) signature', () => {
      const factory = () => new Service();
      const provider = providers.add(AbstractService, factory, ServiceLifetime.Transient).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });
  });

  describe('#addAll()', () => {
    it('should test #addAll([Provider]) signature', () => {
      const provider = new Provider(Service);

      providers.addAll([provider]);

      expect(providers.first()).equals(provider);
    });

    describe('#addAll(ProviderTuple)', () => {
      it('should test #addAll([Type]) signature', () => {
        const provider = providers.addAll([
          [Service],
        ]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAll([Type, ServiceLifetime]) signature', () => {
        const provider = providers.addAll([
          [Service, ServiceLifetime.Transient],
        ]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAll([AbstractType, Type]) signature', () => {
        const provider = providers.addAll([
          [AbstractService, Service],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAll([AbstractType, Provide]) signature', () => {
        const factory = () => new Service();
        const provider = providers.addAll([
          [AbstractService, factory],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });

      it('should test #addAll([AbstractType, object]) signature', () => {
        const instance = new Service();
        const provider = providers.addAll([
          [AbstractService, instance],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(instance);
        expect(provider.factory).equals(null);
      });

      it('should test #addAll([AbstractType, Type, ServiceLifetime]) signature', () => {
        const provider = providers.addAll([
          [AbstractService, Service, ServiceLifetime.Transient],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAll([AbstractType, Provide, ServiceLifetime]) signature', () => {
        const factory = () => new Service();
        const provider = providers.addAll([
          [AbstractService, factory, ServiceLifetime.Transient],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });
    });

    it('should test #addAll([Type]) signature', () => {
      const provider = providers.addAll([Service]).first();

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });
  });

  describe('#addSingleton()', () => {
    describe('#addSingleton(SingletonProviderTuple)', () => {
      it('should test #addSingleton([Type]) signature', () => {
        const provider = providers.addSingleton([Service]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addSingleton([AbstractType, Type]) signature', () => {
        const provider = providers.addSingleton([AbstractService, Service]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addSingleton([AbstractType, Provide]) signature', () => {
        const factory = () => new Service();
        const provider = providers.addSingleton([AbstractService, factory]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });

      it('should test #addSingleton([AbstractType, object]) signature', () => {
        const instance = new Service();
        const provider = providers.addSingleton([AbstractService, instance]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(instance);
        expect(provider.factory).equals(null);
      });
    });

    it('should test #addSingleton(Type) signature', () => {
      const provider = providers.addSingleton(Service).first();

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #addSingleton(AbstractType, Type) signature', () => {
      const provider = providers.addSingleton(AbstractService, Service).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #addSingleton(AbstractType, Provide) signature', () => {
      const factory = () => new Service();
      const provider = providers.addSingleton(AbstractService, factory).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });

    it('should test #addSingleton(AbstractType, object) signature', () => {
      const instance = new Service();
      const provider = providers.addSingleton(AbstractService, instance).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(instance);
      expect(provider.factory).equals(null);
    });
  });

  describe('#addAllSingleton()', () => {
    describe('#addAllSingleton([SingletonProviderTuple])', () => {
      it('should test #addAllSingleton([Type]) signature', () => {
        const provider = providers.addAllSingleton([
          [Service],
        ]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAllSingleton([AbstractType, Type]) signature', () => {
        const provider = providers.addAllSingleton([
          [AbstractService, Service],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAllSingleton([AbstractType, Provide]) signature', () => {
        const factory = () => new Service();
        const provider = providers.addAllSingleton([
          [AbstractService, factory],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });

      it('should test #addAllSingleton([AbstractType, object]) signature', () => {
        const instance = new Service();
        const provider = providers.addAllSingleton([
          [AbstractService, instance],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Singleton);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(instance);
        expect(provider.factory).equals(null);
      });
    });

    it('should test #addAllSingleton([Type]) signature', () => {
      const provider = providers.addAllSingleton([Service]).first();

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Singleton);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });
  });

  describe('#addScoped()', () => {
    describe('#addScoped(ScopedProviderTuple)', () => {
      it('should test #addScoped([Type]) signature', () => {
        const provider = providers.addScoped([Service]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Scoped);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addScoped([AbstractType, Type]) signature', () => {
        const provider = providers.addScoped([AbstractService, Service]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Scoped);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addScoped([AbstractType, Provide]) signature', () => {
        const factory = () => new Service();
        const provider = providers.addScoped([AbstractService, factory]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Scoped);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });
    });

    it('should test #addScoped(Type) signature', () => {
      const provider = providers.addScoped(Service).first();

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Scoped);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #addScoped(AbstractType, Type) signature', () => {
      const provider = providers.addScoped(AbstractService, Service).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Scoped);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #addScoped(AbstractType, Provide) signature', () => {
      const factory = () => new Service();
      const provider = providers.addScoped(AbstractService, factory).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Scoped);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });
  });

  describe('#addAllScoped()', () => {
    describe('#addAllScoped([ScopedProviderTuple])', () => {
      it('should test #addAllScoped([Type]) signature', () => {
        const provider = providers.addAllScoped([
          [Service],
        ]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Scoped);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAllScoped([AbstractType, Type]) signature', () => {
        const provider = providers.addAllScoped([
          [AbstractService, Service],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Scoped);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAllScoped([AbstractType, Provide]) signature', () => {
        const factory = () => new Service();
        const provider = providers.addAllScoped([
          [AbstractService, factory],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Scoped);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });
    });

    it('should test #addAllScoped([Type]) signature', () => {
      const provider = providers.addAllScoped([Service]).first();

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Scoped);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });
  });

  describe('#addTransient()', () => {
    describe('#addTransient(TransientProviderTuple)', () => {
      it('should test #addTransient([Type]) signature', () => {
        const provider = providers.addTransient([Service]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addTransient([AbstractType, Type]) signature', () => {
        const provider = providers.addTransient([AbstractService, Service]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addTransient([AbstractType, Provide]) signature', () => {
        const factory = () => new Service();
        const provider = providers.addTransient([AbstractService, factory]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });
    });

    it('should test #addTransient(Type) signature', () => {
      const provider = providers.addTransient(Service).first();

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #addTransient(AbstractType, Type) signature', () => {
      const provider = providers.addTransient(AbstractService, Service).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });

    it('should test #addTransient(AbstractType, Provide) signature', () => {
      const factory = () => new Service();
      const provider = providers.addTransient(AbstractService, factory).first();

      expect(provider.key).equals(AbstractService);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(null);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(factory);
    });
  });

  describe('#addAllTransient()', () => {
    describe('#addAllTransient([TransientProviderTuple])', () => {
      it('should test #addAllTransient([Type]) signature', () => {
        const provider = providers.addAllTransient([
          [Service],
        ]).first();

        expect(provider.key).equals(Service);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAllTransient([AbstractType, Type]) signature', () => {
        const provider = providers.addAllTransient([
          [AbstractService, Service],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(Service);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(null);
      });

      it('should test #addAllTransient([AbstractType, Provide]) signature', () => {
        const factory = () => new Service();
        const provider = providers.addAllTransient([
          [AbstractService, factory],
        ]).first();

        expect(provider.key).equals(AbstractService);
        expect(provider.lifetime).equals(ServiceLifetime.Transient);
        expect(provider.type).equals(null);
        expect(provider.instance).equals(null);
        expect(provider.factory).equals(factory);
      });
    });

    it('should test #addAllTransient([Type]) signature', () => {
      const provider = providers.addAllTransient([Service]).first();

      expect(provider.key).equals(Service);
      expect(provider.lifetime).equals(ServiceLifetime.Transient);
      expect(provider.type).equals(Service);
      expect(provider.instance).equals(null);
      expect(provider.factory).equals(null);
    });
  });
});

class Service { }

abstract class AbstractService { }
