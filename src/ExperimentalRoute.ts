import { SwaggerCustomizer } from "@nestia/core";

/**
 * Experimental API marking.
 *
 * This decorator marks the API as experimental, so that LLM function calling schema composer
 * excludes the API in the production environments. Of course, test and development environments
 * are not affected by this decorator.
 *
 * In other words, if you adjust the `@ExperimentalRoute()` decorator to the API, the API never
 * participates in the LLM function calling in the production environments. Only test and
 * development environments can access the API through the LLM function calling.
 *
 * @returns Method decorator
 * @author Samchon
 */
export function ExperimentalRoute(): MethodDecorator {
  return function (
    target: Object,
    key: string | symbol | undefined,
    descriptor: PropertyDescriptor,
  ) {
    return SwaggerCustomizer((props) => {
      (props.route as any)["x-wrtn-experimental"] = true;
    })(target, key!, descriptor);
  };
}
