const AsyncFunction = (async () => {}).constructor;
const GeneratorFunction = (function* () {}).constructor;

const predefinedCondition = AsyncFunction !== Function &&
  AsyncFunction !== GeneratorFunction;

export function isAsyncFunction(object: any): boolean {
  return object instanceof AsyncFunction && predefinedCondition;
}
