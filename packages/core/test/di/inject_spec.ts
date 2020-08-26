import { Collection } from '../../src';
import { InjectAll, injectRegistry } from '../../src/di/inject';

// describe('@Inject()');

describe('InjectAll()', () => {
  it('should apply decorator for property', () => {
    class Case {
      @InjectAll(Service)
      services!: Collection<Service>;
    }

    const entry = injectRegistry.first(([key]) => {
      return key.target === Case.prototype &&
        key.propertyKey === 'services';
    });

    console.log(entry[1]);
  });
});

class Service { }
