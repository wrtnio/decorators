import { SwaggerCustomizer } from "@nestia/core";
import { tags } from "typia";

export function SelectorParam<T extends SelectorParam.IElement<any>>(
  neighbor: () => (...args: any[]) => Promise<T[]>
): ParameterDecorator {
  return function (
    target: Object,
    key: string | symbol | undefined,
    index: number
  ): void {
    SwaggerCustomizer((props) => {
      // FIND MATCHED PARAMETER
      const routeArguments:
        | undefined
        | Record<
            string,
            {
              index: number;
              data: string;
            }
          > = Reflect.getMetadata(
        "__routeArguments__",
        target.constructor,
        key!
      );
      if (routeArguments === undefined)
        throw new Error("No path parameter exists.");
      const record = Object.values(routeArguments).find(
        (row: any) => row.index === index
      );
      if (record === undefined) throw new Error("Not path parameter.");
      const param = props.route.parameters?.find((p) => p.name === record.data);
      if (param?.in !== "path") throw new Error("Not path parameter.");

      // DO CUSTOMIZE
      const found = props.at(neighbor());
      if (found === undefined)
        throw new Error("Failed to find the neighbor endpoint.");

      (param as any)["x-wrtn-selector"] = {
        method: found.method,
        path: found.path,
      };
    })(target, key!, index as any);
  };
}
export namespace SelectorParam {
  export interface IElement<T> {
    title: string;
    data: T;
    icon?: string & tags.Format<"uri">;
  }
}
