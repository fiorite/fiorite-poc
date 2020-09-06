# Dependency injection

There are the ways you can bind your service:

   - Using instance (object)
   - Using `Type` (class)
   - Using factory (function)

## Examples

- `Instance/Factory/Type` providers:

```typescript
import '@fiorite/core';

const configure = (providers: ProviderCollection) => {
  // 1. Using instance.

  providers.add('name', 'John');

  // 2. Factory provider
  
  class Person {
    constructor(name: string) { } 
  }
  
  providers.add(Person, services => new Person(services.get('name')));

  // 3. Class provider (auto-wire)
  
  @injectable class PersonRef {
    constructor(person: Person) { }
  }
  
  providers.add(PersonRef);
}
```

- Service collection:

```typescript
import '@fiorite/core';

const configure = (providers: ProviderCollection) => {
  class Fruit {
    constructor(name: string) { } 
  }

  providers.addAll([
    new Fruit('Apple'),
    new Fruit('Pear'),
    new Fruit('Banana'),
  ]);

  class FruitMix {
    constructor(fruit: Collection<Fruit>) {
      for (const x of fruit) {
        // Blend.
      } 
    }
  }
  
  providers.add(FruitMix, services => new FruitMix(services.getAll(Fruit)));
}
```

- Class auto-wiring:

```typescript
import '@fiorite/core';

const configure = (providers: ProviderCollection) => {
  @injectable class Tool { }

  @injectable class Artisan {
    constructor(tool: Tool) { } 
  }

  providers.addAll([Tool, Artisan]);
}
```

- `inject/injectAll` dependency (re-) definition:

```typescript
import '@fiorite/core';

const configure = (providers: ProviderCollection) => {
  const entrySymbol = Symbol();

  interface Register {
    add(entry: string): void; 
  }

  const registerSymbol = Symbol();

  class Registry {
    constructor(
      @inject(registerSymbol) register: Register,
      @injectAll(entrySymbol) entries: Collection<string>
    ) {
      entries.forEach(register.add); 
    } 
  }

  providers.addAll([
    [entrySymbol, 'Car'],
    [entrySymbol, 'Bar'],

    [registerSymbol, {
      add(entry: string) {
        console.log(entry + ' has been added.');  
      },
    }],

    Registry,
  ]);
}
```

- Custom `inject/injectAll`:

```typescript
import '@fiorite/core';

const configure = (providers: ProviderCollection) => {
  class Logger {
    logError(message: string) {
      console.error(message);
    }
  }

  const errorLogger = (resource: string) => {
    // Re-define injection result.
    return inject(Logger, logger => {
      // Use your own log function.
      return (message: string) => {
        logger.logError(resource + ': ' + message);
      };
    });
  };

  class Consumer {
    constructor(@errorLogger('Consumer') log: Function) {
      log('Implement me!'); // logs: 'Consumer: Implement me!'
    } 
  }

  providers.add([
    Logger,
    Consumer,
  ]);
}
```

- Service lifetimes: `Singleton (Default), Scoped and Transient`:

```typescript
import '@fiorite/core';

const configure = (providers: ProviderCollection) => {
  // Person will be the same for any month.
  @singleton class Person {
    receive(salary: number); 
  }

  // Salary is different for every client.
  @transient class Salary {
    constructor() { } 
  }

  // Describes
  @scoped class BusinessMonth {
     constructor() { }
  }

  const errorLogger = (resource: string) => {
    // Re-define injection result.
    return inject(Logger, logger => {
      // Use your own log function.
      return (message: string) => {
        logger.logError(resource + ': ' + message);
      };
    });
  };

  class Consumer {
    constructor(@errorLogger('Consumer') log: Function) {
      log('Implement me!'); // logs: 'Consumer: Implement me!'
    } 
  }

  providers.add([
    Logger,
    Consumer,
  ]);
}
```
