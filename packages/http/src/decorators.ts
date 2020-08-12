import 'reflect-metadata';
import { HttpContext } from './http.context';
import { Inject } from '@fiorite/core';
import { HttpHeaders } from './http.headers';

interface MethodRoute {
  handler: <T>(controller: T, context: HttpContext) => unknown;
}

export function Controller(): ClassDecorator {
  return () => void 0;
}

/**
 * Returns {@link string[]},
 *
 * @param key
 * @constructor
 */
export function HttpHeader(key: string) {
  return Inject(HttpHeaders, headers => headers.get(key));
}

// export function HttpHeader(key: string): ParameterDecorator {
//   return (target, propertyKey, parameterIndex) => {
//       // [ 'design:returntype', 'design:paramtypes', 'design:type' ]
//       console.log(
//         'Header',
//         parameterIndex,
//         Reflect.getMetadata('design:returntype', target, propertyKey),
//         Reflect.getMetadata('design:paramtypes', target, propertyKey),
//         Reflect.getMetadata('design:type', target, propertyKey),
//       );
//   };
//
//   // return (target, propertyKey, ) => {
//   //   const method = 'get';
//   //
//   //   const handler = (controller: Object, ...args: unknown[]) => {
//   //     return (descriptor.value as unknown as Function).call(controller, ...args);
//   //   }
//   //
//   //   // [ 'design:returntype', 'design:paramtypes', 'design:type' ]
//   //   console.log(
//   //     Reflect.getMetadata('design:returntype', target, propertyKey),
//   //     Reflect.getMetadata('design:paramtypes', target, propertyKey),
//   //     Reflect.getMetadata('design:type', target, propertyKey),
//   //   );
//   //
//   //   console.log(target.constructor, method, handler);
//   // };
// }

export function HttpGet(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const method = 'get';

    const handler = (controller: Object, ...args: unknown[]) => {
      return (descriptor.value as unknown as Function).call(controller, ...args);
    }

    // [ 'design:returntype', 'design:paramtypes', 'design:type' ]
    // console.log(
    //   'HttpGet',
    //   Reflect.getMetadata('design:returntype', target, propertyKey),
    //   Reflect.getMetadata('design:paramtypes', target, propertyKey),
    //   Reflect.getMetadata('design:type', target, propertyKey),
    // );

    // console.log(target.constructor, method, handler);
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

