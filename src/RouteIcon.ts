import { SwaggerCustomizer } from "@nestia/core";
import typia, { tags } from "typia";

export function RouteIcon(url: string & tags.Format<"uri">): MethodDecorator {
  typia.assert(url);
  return function (
    target: Object,
    key: string | symbol | undefined,
    descriptor: PropertyDescriptor
  ) {
    return SwaggerCustomizer((props) => {
      (props.route as any)["x-wrtn-icon"] = url;
    })(target, key!, descriptor);
  };
}
