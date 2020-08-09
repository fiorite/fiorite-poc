import 'reflect-metadata';
import { HttpContext } from './http.context';

interface MethodRoute {
  handler: <T>(controller: T, context: HttpContext) => unknown;
}

export function Header(key: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
      // [ 'design:returntype', 'design:paramtypes', 'design:type' ]
      console.log(
        'Header',
        parameterIndex,
        Reflect.getMetadata('design:returntype', target, propertyKey),
        Reflect.getMetadata('design:paramtypes', target, propertyKey),
        Reflect.getMetadata('design:type', target, propertyKey),
      );
  };

  // return (target, propertyKey, ) => {
  //   const method = 'get';
  //
  //   const handler = (controller: Object, ...args: unknown[]) => {
  //     return (descriptor.value as unknown as Function).call(controller, ...args);
  //   }
  //
  //   // [ 'design:returntype', 'design:paramtypes', 'design:type' ]
  //   console.log(
  //     Reflect.getMetadata('design:returntype', target, propertyKey),
  //     Reflect.getMetadata('design:paramtypes', target, propertyKey),
  //     Reflect.getMetadata('design:type', target, propertyKey),
  //   );
  //
  //   console.log(target.constructor, method, handler);
  // };
}

export function HttpGet(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const method = 'get';

    const handler = (controller: Object, ...args: unknown[]) => {
      return (descriptor.value as unknown as Function).call(controller, ...args);
    }

    // [ 'design:returntype', 'design:paramtypes', 'design:type' ]
    console.log(
      'HttpGet',
      Reflect.getMetadata('design:returntype', target, propertyKey),
      Reflect.getMetadata('design:paramtypes', target, propertyKey),
      Reflect.getMetadata('design:type', target, propertyKey),
    );

    console.log(target.constructor, method, handler);
  };
}

export function HttpPost(): MethodDecorator {
  return () => void 0;
}

export function HttpPut(): MethodDecorator {
  return () => void 0;
}

export function HttpDelete(): MethodDecorator {
  return () => void 0;
}

