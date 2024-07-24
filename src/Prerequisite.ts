import { SwaggerCustomizer } from "@nestia/core";
import { RouteParamtypes } from "@nestjs/common/enums/route-paramtypes.enum";
import { OpenApi } from "@samchon/openapi";
import { tags } from "typia";

/**
 * Prerequisite API interaction type.
 *
 * `Prerequisite` is a type representing a prerequisite API interaction.
 * It means that, the `Prerequisite` typed value would be be composed by the
 * target prerequisite API interaction.
 *
 * The target API pointed by `Prerequisite` returns a response, which is
 * composed by an array of elements, or array transformable instance that
 * would be filtered by the `Prerequisite.Props.array` function.
 *
 * When user selects an element from the array, the target value be
 * extracted by the `Prerequisite.Props.value` function.
 *
 * @template Props Properties of the Prerequisite API interaction
 * @author Samchon
 */
export type Prerequisite<
  Props extends {
    /**
     * Prerequisite API method.
     */
    method: "get" | "post" | "patch" | "put" | "delete";

    /**
     * Prerequisite API path.
     */
    path: string;

    /**
     * JmesPath, which means value and label on the target.
     * Value is a value required to call and usually means a unique ID value in each service,
     * and label means a recognizable value to express what it means.
     *
     * @example
     * // JSON
     * {
     *   "locations": [
     *     {"name": "Seattle", "no": 1},
     *     {"name": "New York", "no": 2}
     *   ]
     * }
     *
     * @example
     * // JmesPath
     * locations[].{value: no, label: name}
     *
     * @example
     * // Results
     * [
     *   { "value": 1, "label": "Seattle" },
     *   { "value": 2, "label": "New York" }
     * ]
     */
    jmesPath: string;
  },
> = tags.JsonSchemaPlugin<{
  "x-wrtn-prerequisite": Props;
}>;

/**
 * Prerequisite API interation decorator.
 *
 * `@Prerequisite()` is a method decorator to specify a prerequisite API.
 * The prerequisite API means that, the decorated parameter value would be
 * composed by the target prerequisite API interaction.
 *
 * The target API pointed by `Prerequisite` returns a response, which is
 * composed by an array of elements. When user selects an element from the
 * array, the parameter decorated value would be extracted by the
 * `value` function.
 *
 * For reference, the `value` function must have maximum 3 parameters, and
 * you must follow these names; (`elem`, `index`, `array`). If your parameters
 * does not follow the names, the decorator would throw an error.
 *
 * Otherwise you want to interact the prerequisite API not in the parameter
 * level, but in the nested property level, you can utilize `Prerequisite`
 * type instead.
 *
 * @param neighbor Neighbor prerequisite API to interact
 * @param jmesPath `JMESPath`, which means value and label on the target
 * @returns Method decorator
 * @author Samchon
 */
export function Prerequisite(props: {
  neighbor: Function;
  jmesPath: string;
}): ParameterDecorator {
  return function (
    target: Object,
    key: string | symbol | undefined,
    index: number,
  ): void {
    SwaggerCustomizer((asset) => {
      // FIND NEIGHBOR
      const endpoint: SwaggerCustomizer.ISwaggerEndpoint | undefined = asset.at(
        props.neighbor(),
      );
      if (endpoint === undefined)
        throw new Error("Failed to find the neighbor endpoint.");

      // FIND MATCHED PARAMETER
      const routeArguments: undefined | Record<string, INestParam> =
        Reflect.getMetadata("__routeArguments__", target.constructor, key!);
      if (routeArguments === undefined) throw new Error("No parameter exists.");
      const metadata: [string, INestParam] | undefined = Object.entries(
        routeArguments,
      ).find((row) => row[1].index === index);
      if (metadata === undefined) throw new Error("Not parameter.");

      // CONSTRUCT PLUGIN
      const [nKey, nParam]: [string, INestParam] = metadata;
      const plugin = {
        "x-wrtn-prerequisite": {
          method: endpoint.method,
          path: endpoint.path,
          jmesPath: props.jmesPath,
        },
      };

      // PARAMETER CASE
      const param: OpenApi.IOperation.IParameter | undefined =
        asset.route.parameters?.find((p) => p.name === nParam.data);
      if (param !== undefined) Object.assign(param.schema, plugin);
      // REQUEST BODY CASE
      else if (asset.route.requestBody !== undefined && isBody(nKey, nParam)) {
        if (asset.route.requestBody.content === undefined)
          throw new Error("No content exists in the request body.");
        for (const contentType of [
          "text/plain",
          "application/json",
          "application/x-www-form-url-encoded",
          "multipart/form-data",
          "*/*",
        ] as const) {
          const media = asset.route.requestBody.content[contentType];
          if (media?.schema !== undefined) Object.assign(media.schema, plugin);
        }
      }
      // NOTHING
      else
        throw new Error(
          "No matched parameter exists. Check your parameter decorators.",
        );
    })(target, key!, index as any);
  };
}

interface INestParam {
  name: string;
  index: number;
  factory?: (...args: any) => any;
  data: string | undefined;
}

const isBody = (key: string, param: INestParam): boolean => {
  const symbol: string = key.split(":")[0];
  if (symbol.indexOf("__custom") !== -1) {
    if (param.factory === undefined) return false;
    return (
      param.factory.name === "EncryptedBody" ||
      param.factory.name === "PlainBody" ||
      param.factory.name === "TypedQueryBody" ||
      param.factory.name === "TypedBody" ||
      param.factory.name === "TypedFormDataBody"
    );
  }
  const typeIndex: RouteParamtypes = Number(symbol[0]) as RouteParamtypes;
  return (
    typeIndex === RouteParamtypes.BODY || typeIndex === RouteParamtypes.RAW_BODY
  );
};
