import { tags } from "typia";

/**
 * JSON Schema 의 `const` 타입에 `title` 과 `description` 을 달아주는 타입.
 *
 * 아래와 같이 원시 원자 타입들에 대하여 사용 가능하다.
 *
 * ```typescript
 * const value: Constant<"something", {
 *   title: "interesting",
 *   description: "This is something interesting."
 * }>;
 * ```
 *
 * 그리고 이렇게 타입을 선언한 경우, JSON schema 는 아래와 같이 생성된다.
 *
 * ```json
 * {
 *   "const": "something",
 *   "title": "interesting",
 *   "description": "This is something interesting."
 * }
 * ```
 *
 * @deprecated `const enum` 쓰거나 `typia.tags.Constant` 로 대체해주세요
 * @author Samchon
 */
export type Constant<
  T extends boolean | number | string,
  Schema extends {
    title?: string;
    description?: string;
  },
> = T & tags.JsonSchemaPlugin<Schema>;
