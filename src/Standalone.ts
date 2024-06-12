import { SwaggerCustomizer } from "@nestia/core";

export function Standalone(value: boolean = true): MethodDecorator {
  return function (
    target: Object,
    key: string | symbol | undefined,
    descriptor: PropertyDescriptor,
  ) {
    return SwaggerCustomizer((props) => {
      (props.route as any)["x-wrtn-standalone"] = value;
    })(target, key!, descriptor);
  };
}
