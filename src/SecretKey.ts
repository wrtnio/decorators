import {tags} from "typia";

/**
 * JSON Scheme에 `x-secret-key` 를 추가해주는 타입.
 *
 * 아래와 같이 원시 원자 타입들에 대하여 사용 가능하다.
 *
 * - `string & SecretKey<"Some secret">`
 *
 * @reference https://typia.io/docs/json/schema/#customization
 * @author Jake
 */
export type SecretKey<Value extends string> = tags.TagBase<{
  target: "string";
  kind: "SecretKey";
  value: undefined;
  schema: {
    "x-secret-key": Value;
  };
}>;
