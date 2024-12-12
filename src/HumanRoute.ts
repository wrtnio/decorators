import { SwaggerCustomizer } from "@nestia/core";

/**
 * Human only API marking.
 *
 * This decorator marks the API as human only, so that LLM function calling schema composer
 * excludes the API.
 *
 * In other words, if you adjust the `@HumanRoute()` decorator to the API, the API never
 * participates in the LLM function calling.
 *
 * @returns Method decorator
 * @author Samchon
 */
export function HumanRoute(): MethodDecorator {
  return function (
    target: Object,
    key: string | symbol | undefined,
    descriptor: PropertyDescriptor,
  ) {
    return SwaggerCustomizer((props) => {
      (props.route as any)["x-samchon-human"] = true;
    })(target, key!, descriptor);
  };
}
