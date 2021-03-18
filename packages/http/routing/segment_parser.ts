import { NotImplementedError } from '@fiorite/core';

import { DynamicSegment } from './segments/dynamic';

// const pattern = //;

export class SegmentParser {
  static readonly default = new SegmentParser();

  private constructor() { }

  parse(expression: string): DynamicSegment {
    const splitIndex = expression.indexOf('|');
    let variable = expression;

    if (splitIndex > -1) {
      variable = expression.slice(0, splitIndex).trim();
      const typeExpression = expression.slice(splitIndex + 1, expression.length).trim();

      let typeName = typeExpression;
      let typeArguments: unknown[] = [];
      const functionIndex = typeExpression.indexOf('(');

      if (functionIndex > -1) {
        typeName = typeExpression.slice(0, functionIndex);
        const argumentExpression = typeExpression.slice(functionIndex, typeExpression.length);

        console.log(argumentExpression);


        // todo: parse arguments.

        // parse function arguments
      }

      // todo: check variable validity.
      console.log(typeName, variable, typeName, typeArguments);
    }

    if (expression.trim().endsWith('*')) {
      expression = expression.replace('*', '');
      return DynamicSegment.wildcard(expression);
    }
    // todo: implement it.
    return DynamicSegment.default(expression);
  }
}
