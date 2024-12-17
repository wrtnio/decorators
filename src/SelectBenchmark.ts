import { SwaggerCustomizer } from "@nestia/core";

export function SelectBenchmark(keyword: string | string[]): MethodDecorator {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    return SwaggerCustomizer((props) => {
      (props.route as any)["x-wrtn-function-select-benchmarks"] ??= [];
      (props.route as any)["x-wrtn-function-select-benchmarks"].push(
        ...(Array.isArray(keyword) ? keyword : [keyword]),
      );
    })(target, key, descriptor);
  };
}
