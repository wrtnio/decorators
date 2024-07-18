/**
 * @title The type that verifies the type 'any'.
 *
 * @template {T} target
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * It is a type that means an expression and is a type that corresponds to an element of the equal type.
 * If the two expressions are completely the same, the factors of the expression are also verified using the same.
 *
 * @template {X} Parameter
 */
export type Expression<X> = <T>() => T extends X ? 1 : 2;

/**
 * @template {X}
 * @template {Y}
 *
 * @title Type to check if both types are the same type
 */
export type Equal<X, Y> = Expression<X> extends Expression<Y> ? true : false;

/**
 * @template {T} Target
 *
 * @title The type that deduces the element type of the array.
 */
export type ElementOf<T extends Array<any>> = T extends (infer E)[] ? E : never;

/**
 * @title It verifies whether the generic type 'T' is the same as its own element.
 */
export type IsPartitionSameEntire<T, P = T> = T extends any // Conditional type for separating T into each element type
  ? P extends T // If it is a union type, `false | true` must come out of this conditional type.
    ? false
    : true
  : never;

/**
 * @title The type that verifies the union type.
 */
export type IsUnion<T> =
  Equal<IsPartitionSameEntire<T>, boolean> extends true ? true : false;

/**
 * @title JavaScript types
 */
export type ValueType =
  | number
  | boolean
  | string
  | null
  | undefined
  | symbol
  | bigint
  | Date;

export type DeepStrictObjectKeysHelper<
  T extends object,
  P extends keyof T = keyof T,
> = P extends string
  ? IsUnion<T[P]> extends true
    ? P
    : T[P] extends Array<infer Element extends object>
      ? P | `${P}[].${DeepStrictObjectKeysHelper<Element>}`
      : T[P] extends ValueType
        ? P
        : IsAny<T[P]> extends true
          ? P
          : T[P] extends object
            ? T[P] extends Array<infer Element>
              ? P
              : T[P] extends Record<string, never>
                ? `${P}`
                : `${P}` | `${P}.${DeepStrictObjectKeysHelper<T[P]>}`
            : never
  : never;

/**
 * @title The type that marks all keys in a nested object or array.
 *
 * It is a type of pulling all keys of overlapping objects,
 * and if there is an overlapping object,
 * the object is expressed based on the point symbol.
 * In the case of an array, the '[]' symbol is used to indicate it.
 *
 * ```ts
 * type Example1 = DeepStrictObjectKeys<{ a: { b: 1; c: 2 } }>; // "a" | "a.b" | "a.c"
 * type Example2 = DeepStrictObjectKeys<{ a: { b: 1; c: { d: number }[] } }>; // "a" | "a.b" | "a.c" | "a.c[].d"
 * ```
 */
export type DeepStrictObjectKeys<
  T extends object,
  P extends keyof T = keyof T,
> =
  T extends Array<infer Element>
    ? Element extends object
      ? `[].${DeepStrictObjectKeys<Element>}`
      : `[].${keyof Element extends string ? keyof Element : never}`
    : DeepStrictObjectKeysHelper<T, P>;

/**
 * @title A is the type that transforms the shape of B
 */
export type Allow<A, B> = A extends B ? A : never;
export type ToObject<T> = Allow<T, object>;

/**
 * @title The type that draws only objects from key names that infer members.
 *
 * It is a helper type for use in other types, a type that cuts the back string to infer objects among keys inferred as {@link DeepStrictObjectKeys}.
 *
 * ```ts
 * type Example = RemoveArraySymbol<"a[]">; // a
 * ```
 */
export type RemoveArraySymbol<T extends string> = T extends `${infer P}[]`
  ? P
  : T;

/**
 * @title Type to infer all value types of generic T
 */
export type ValueOf<T> = T[keyof T];

/**
 * @title exact type of {@link String.prototype.split}
 */
export type Split<
  T extends string,
  P extends string = "",
> = T extends `${infer F}${P}${infer Rest}`
  ? [F, ...Split<Rest, P>]
  : T extends ""
    ? []
    : [T];

/**
 * @title The type that deduces the last element of the array.
 */
export type Tail<T extends readonly string[]> = T extends readonly [
  unknown,
  ...infer Rest,
]
  ? Rest
  : [];

/**
 * @title exact type of {@link String.prototype.join}
 */
export type Join<
  T extends readonly string[],
  U extends string = ",",
> = T extends readonly []
  ? ""
  : T extends readonly [infer F]
    ? F
    : `${T[0]}${U}${Join<Tail<T>, U>}`;

/**
 * @title The type that pulls out the type of a particular key on an interface.
 * @template {T}
 * @template {K}
 *
 * ```ts
 * type Example1 = GetType<{ a: { b: { c: number } } }, "a.b">; // { c: number }
 * type Example = GetType<{ a: { b: { c: number } } }, "a.b.c">; // number
 * ```
 */
export type GetType<T extends object, K extends DeepStrictObjectKeys<T>> =
  Split<K, "."> extends [infer First extends keyof T]
    ? ValueOf<ToObject<Pick<T, First>>>
    : Split<K, "."> extends [
          infer First extends string,
          ...infer Rest extends string[],
        ]
      ? RemoveArraySymbol<First> extends keyof T
        ? ValueOf<ToObject<Pick<T, RemoveArraySymbol<First>>>> extends object
          ? ValueOf<ToObject<Pick<T, RemoveArraySymbol<First>>>> extends Array<
              infer E
            >
            ? E extends object
              ? GetType<E, Allow<Join<Rest, ".">, DeepStrictObjectKeys<E>>>
              : E
            : GetType<
                ValueOf<ToObject<Pick<T, RemoveArraySymbol<First>>>>,
                Allow<
                  Join<Rest, ".">,
                  DeepStrictObjectKeys<
                    ValueOf<ToObject<Pick<T, RemoveArraySymbol<First>>>>
                  >
                >
              >
          : never
        : never
      : never;

/**
 * @title Type to infer the value type of properties deduced by Array
 */
export type OnlyArrayProps<T extends object> = keyof {
  [K in DeepStrictObjectKeys<T> as GetType<T, K> extends Array<any>
    ? K
    : never]: GetType<T, K>;
};

export type OmitObject<T extends object> = {
  [K in keyof T as T[K] extends object ? never : K]: T[K] extends object
    ? OmitObject<T[K]>
    : T[K];
};

export type GetElementsOfArray<
  T extends object,
  ArrayPropertyName extends DeepStrictObjectKeys<T, keyof T>,
> = ArrayPropertyName extends infer K extends DeepStrictObjectKeys<T, keyof T>
  ? GetType<T, K> extends any[]
    ? keyof OmitObject<ElementOf<GetType<T, K>>> extends infer R extends string // It is inferred as string and maps 'keyof' values to R (ReturnType) so that they can be used immediately.
      ? R
      : never
    : never
  : never;

export type JMESPathHelper<T extends object> =
  OnlyArrayProps<T> extends infer ArrayProps extends string
    ? ArrayProps extends infer Key extends DeepStrictObjectKeys<T, keyof T> // To separate ArrayProps into a single key unit
      ? `${T extends Array<any> ? "[]." : ""}${ArrayProps}[].{value:${GetElementsOfArray<T, Key>}, label:${GetElementsOfArray<T, Key>}}`
      : never
    : never;

/**
 * @title Type that creates 'JMESPath' from the object
 *
 * It is not intended to cover the number of all cases,
 * but is a type for finding an array-type property inside an object and mapping labels and values among them.
 * It is used to make the internal properties of our Prequisite.
 *

 * @example
 * interface Example {
 *   arr1: {
 *     id1: number;
 *     name1: string;
 *   }[];
 *   arr2: {
 *     id2: number;
 *     name2: string;
 *     arr3: {
 *       id3: number;
 *       name3: string;
 *     }[];
 *   }[];
 *   otherProps: string;
 * }
 *
 * // The second Generic type that is automatically deduced
 * type Path1 = JMESPath<Example, "arr2[].{value:name2, label:name2}">; 
 * type Path2 = JMESPath<Example[], "[].arr2[].{value:name2, label:name2}">;
 * 
 * // Use like this!
 * type Response = Prerequisite<{
 *   method: "post";
 *   path: "path of api";
 *   JMESPath: JMESPath<Example, "[].arr2[].{value:name2, label:name2}">;
 * }>;
 */
export type JMESPath<
  T extends object,
  JMESPath extends T extends Array<infer E extends object>
    ? keyof E extends string
      ?
          | `[].{value:${keyof OmitObject<E>}, label:${keyof OmitObject<E>}}` // if API's response type is Array<infer E>, We must get keyof type of E.
          | `[].${JMESPathHelper<E>}`
      : never
    : JMESPathHelper<T>,
> = JMESPath;
