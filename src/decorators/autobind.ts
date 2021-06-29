// AutoBind Decorator - fixes this pointer issue on submitHandler
namespace App {
  export function AutoBind(
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    console.log(descriptor);

    const adjustedMethod = {
      configurable: true,
      enumerable: false,
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      },
    };
    return adjustedMethod;
  }
}
