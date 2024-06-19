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
     * Transform function returning array instance.
     *
     * `Prerequisite.Props.array` is a string typed property representing
     * a function returning an array instance from the response of the
     * prerequisite API.
     *
     * The function script must be a string value that can be parsed by
     * `new Function(string)` statement. Also, its parameter name is
     * always `response`.
     *
     * If the prerequisite API responses an array and it is the desired one,
     * you don't need to specify this property.
     *
     * - type: `array: (response: Response) => Elemenet[]`
     * - example: `return response.members.map(m => m.data)`
     * - how to use: `new Function("response", arrayScript)(response)`
     */
    array?: string;

    /**
     * Transform function returning target value.
     *
     * `Prerequisite.Props.value` is a string typed property representing
     * a function returning the target value from the element instance of
     * the prerequisite API respond array. If you've defined this `Prerequisite`
     * type to a `number` type, the returned value must be actual number type.
     *
     * The function script must be a string value that can be parsed by
     * `new Function(string)` statement. Also, its parameter names are always
     * `elem`, `index` and `array`.
     *
     * - type: `value: (elem: Element, index: number, array: Element[]) => Value`
     * - example: `return elem.no`
     * - how to use: `new Function("elem", "index", "array", valueScript)(...)`
     */
    value: string;
  },
> = tags.JsonSchemaPlugin<{
  "x-wrtn-prerequisite": {
    method: Props["method"];
    path: Props["path"];
    array: Props["array"] extends string ? Props["array"] : "return response";
    value: Props["value"];
  };
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
 * - example: `(elem) => elem.no`
 * - how to use: `new Function("elem", "index", "array", valueScript)(...)`
 *
 * @param neighbor Neighbor prerequisite API to interact
 * @param value Value extracting function
 * @returns Method decorator
 * @author Samchon
 */
export function Prerequisite<PElement, Value>(
  neighbor: () => (...args: any[]) => Promise<PElement[]>,
  value: (elem: PElement, index: number, array: PElement[]) => Value,
): ParameterDecorator;

/**
 * Prerequisite API interation decorator.
 *
 * `@Prerequisite()` is a method decorator to specify a prerequisite API.
 * The prerequisite API means that, the decorated parameter value would be
 * composed by the target prerequisite API interaction.
 *
 * The target API pointed by `Prerequisite` returns a response, which would
 * be converted to an array of elements by `array` function. When user selects
 * an element from the array, the parameter decorated value would be extracted
 * by the `value` function.
 *
 * For reference, the `value` function must have maximum 3 parameters, and
 * you must follow these names; (`elem`, `index`, `array`). If your parameters
 * does not follow the names, the decorator would throw an error. The `array`
 * function has the same restriction, so that you have to make it to have
 * only one named parameter; (`response`).
 *
 * Otherwise you want to interact the prerequisite API not in the parameter
 * level, but in the nested property level, you can utilize `Prerequisite`
 * type instead.
 *
 * - Value
 *   - example: `(elem) => elem.no`
 *   - how to use: `new Function("elem", "index", "array", valueScript)(...)`
 * Array
 *   - example: `(response) => response.members.map(m => m.data)`
 *   - how to use: `new Function("response", arrayScript)(response)`
 *
 * @param neighbor Neighbor prerequisite API to interact
 * @param array Array transforming function
 * @param value Value extracting function
 * @returns Method decorator
 * @author Samchon
 */
export function Prerequisite<PResponse, PElement, Value>(
  neighbor: () => (...args: any[]) => Promise<PResponse>,
  array: (response: PResponse) => PElement[],
  value: (value: PElement, index: number, array: PElement[]) => Value,
): ParameterDecorator;

export function Prerequisite(
  neighbor: Function,
  f1: Function,
  f2?: Function,
): ParameterDecorator {
  const valueFunc: Function = f2 ?? f1;
  const arrayFunc: Function =
    f2 === undefined ? (response: any) => response : f1;
  return function (
    target: Object,
    key: string | symbol | undefined,
    index: number,
  ): void {
    SwaggerCustomizer((props) => {
      // FIND NEIGHBOR
      const endpoint: SwaggerCustomizer.ISwaggerEndpoint | undefined =
        props.at(neighbor());
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
          value: assertValue(valueFunc),
          array: assertArray(arrayFunc),
        },
      };

      // PARAMETER CASE
      const param: OpenApi.IOperation.IParameter | undefined =
        props.route.parameters?.find((p) => p.name === nParam.data);
      if (param !== undefined) Object.assign(param.schema, plugin);
      // REQUEST BODY CASE
      else if (props.route.requestBody !== undefined && isBody(nKey, nParam)) {
        if (props.route.requestBody.content === undefined)
          throw new Error("No content exists in the request body.");
        for (const contentType of [
          "text/plain",
          "application/json",
          "application/x-www-form-url-encoded",
          "multipart/form-data",
          "*/*",
        ] as const) {
          const media = props.route.requestBody.content[contentType];
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

const assertValue = (func: Function): string => {
  const script: string = func.toString();
  const params: string[] | null = assertParameters(script);
  const valid: boolean =
    params !== null &&
    (params.length < 1 || params[0] === "elem") &&
    (params.length < 2 || params[1] === "index") &&
    (params.length < 3 || params[2] === "array");
  if (valid === false) {
    console.log(params);
    throw new Error(
      "Invalid value function parameters. It must be (elem, index?, array?)",
    );
  }
  return `return (${script})(elem, index, array)`;
};
const assertArray = (func: Function): string => {
  const script: string = func.toString();
  const params: string[] | null = assertParameters(script);
  const valid: boolean =
    params === null || params.length === 0 || params[0] === "response";
  if (valid === false)
    throw new Error("Invalid array function parameters. It must be (response)");
  return `return (${script})(response)`;
};
const assertParameters = (script: string): string[] | null => {
  const left: number = script.indexOf("(") + 1;
  const right: number = script.indexOf(")", left);
  if (left === -1 || right === -1) return null;
  return script
    .substring(left, right)
    .split(",")
    .map((s) => s.trim());
};
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
