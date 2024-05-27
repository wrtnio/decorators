# `@wrtn/decorators`

NestJS 디코레이터 모음.

```bash
npm i @wrtn/decorators
```

## `Constant<Value>`

JSON schema 의 `const` 타입에, `title` 과 `description` 을 채워주는 태그.

```typescript
import { Constant } from "@wrtn/decorators";

export type Something = Constant<
  "something",
  {
    title: "interesting";
    description: "This is something interesting.";
  }
>;
```

- 생성된 JSON schema: https://typia.io/playground/?script=JYWwDg9gTgLgBDAnmYBDANHA3g1BzAZzgF84AzKCEOAIiRVRoG4AoFgUwA9JYFl24AYQgA7AjFQiYAHhZw4AFThcY7EQBMiAIwgQANu0lwAPnBEBXEFvZQTccVGAi86OXADKAYwAW7EKmVOVQ0iLDd5GGAYAwB+AC57GEdnVnl5dXYCT0cwSNF4xOS8VJJXAD44AF5FOAAyXEIAOgApAlEvX38ABT1zPCdpDr9UMtYWejRGgCs2kUbUMDA9YE9UPJFpAG03YTEJKWkaNpB2GG8nPBpMMLSEKIMEmidVKEzI52ZwuAysnPXHhTnIjAIjHU7nZxwZ42N4XRqfeTEMquAC6ZQAFABKJhAA

## `Placeholder<string>`

```typescript
import { Placeholder } from "@wrtn/decorators";
import { tags } from "typia";

export interface Something {
  /**
   * 고객의 이름.
   *
   * @title 이름
   */
  name: string & Placeholder<"이름을 입력해주세요.">;

  /**
   * 고객의 생년월일.
   *
   * @title 생년월일
   */
  birthdate: string &
    tags.Format<"date"> &
    Placeholder<"생년월일을 입력해주세요. 형식은 YYYY-MM-DD 입니다.">;

  flag: number & Placeholder<"Something">;
}
```

- 생성된 JSON schema: https://typia.io/playground/?script=JYWwDg9gTgLgBDAnmYBDANHA3g1BzAZzgF84AzKCEOAIiRVRoG4AoF+gUzgAUAbVAMYcAFhF4ATDlAA8ANVS8Arlw4APGBwB24ogRhRgmvAD44AXlyEAdABV8AIVQEO0rCzi4oeDjABctACMIMQ5UTRo4AB9aTUUQAKkI6Jo9AyNmdzgAa0NxfxowfiFRCUTWDwA3BWV-eSUOcrgCAWEOEFR-Nw8PGlUAWgB3WE0+wsERMUkoGlrqhsziVmJjVhZDDSgycbgAZSofYUM8bEyAegAqc8y4c7hAA5rAXBrADXG4QBdxwBDOq2ur7tuAARgwBgvC4H2+p0ymlQIA4-lSRzgADIeEUJqUZDQAOoGDRwRAQRRQOBQmFWGgrNgeC4-Dy3R4vQC7A4ARRsAK2OAH3Gvr9vnAAUCQXBmezwZkAsBYMJxKgNHD9AjEddLAQrAAxaDtGDSGiSjTkpEKvjjEpTTXYoFcfGEuCi8XajhWOA2VrkNVSuDAIgATS9Hr6AFlfX0ACKBskUzJkfh4fyxeJSJEow2TKSavYwmCHdIU4hsehoKwAKwIEE0VlQYEKwAEUuAxekAG1UwcjgBdYwACgAlEwgA

`boolean` 이나 `number` 및 `string` 타입을 부여할 때, 위와 같이 `Placeholder<string>` 타입을 `intersection (&)` 으로 결합해주면, JSON schema 에 `x-wrtn-placeholder` 속성이 추가된다.

만일 위와 같은 JSON schema customizer 가 필요하다면, 아래 문서를 보고 참고하여, 새로운 JSON schema customizer 타입을 만들어주도록 하자. 그리고 새로이 추가한 커스텀 속성에 대하여, inspector 개발자들에게 전파하도록 한다.

- https://typia.io/docs/json/schema/#customization

## `@RouteIcon()`

```typescript
export function RouteIcon(uri: string): MethodDecorator;
```

Controller 메서드에 `@RouteIcon()` 을 적용하면, 아이콘을 적용할 수 있다.

`@RouteIcon(url: string)` 에 입력한 URL 주소는 스웨거 문서의 해당 endpoint 부에, `ISwaggerRoute["x-wrtn-icon"]` 속성으로 기입된다.

단, 본 디코레이터는 파라미터로 입력한 URL 값의 실존 여부를 검증하지 않으니, 이 점 주의하기 바란다.

## `@SelectorParam()`

```typescript
export function SelectorParam<T extends SelectorParam.IElement<any>>(
  neighbor: () => (...args: any[]) => Promise<T[]>
): ParameterDecorator;
export namespace SelectorParam {
  export interface IElement<T> {
    title: string;
    data: T;
  }
}
```

Path parameter 에 `@SelectorParam()` 를 적용하면 된다.

단 `@SelectorParam()` 에 적용하는 대상 메서드는, 반드시 `title` 과 `data` 필드가 정의된 객체의 배열 타입을 리턴해야 한다.

이후 `npx nestia swagger` 명령어를 통하여 스웨거 문서를 생성하는 경우, 아래와 같이 `swagger.json` 파일의 해당 endpoint 객체에 `"x-wrtn-selector"` 라는 필드가 추가된다.

```typescript
@Controller("connector/google-calendar")
import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { RouteIcon, SelectorParam } from "@wrtn/decorators";

import { IGoogleCalendar } from "@wrtn/connector-api/lib/structures/connector/google_calendar/IGoogleCalendar";
import { GoogleCalendarProvider } from "../../../providers/connector/google_calendar/GoogleCalendarProvider";

@Controller("connector/google-calendar")
export class GoogleCalendarController {
  @RouteIcon("https://typia.io/favicon/android-chrome-192x192.png")
  @core.TypedRoute.Post("/:calendarId/get-events")
  public async readEvents(
    // 대상 메서드의 리턴 타입은 반드시,
    // title 및 data 등의 속성을 담은 오브젝트의 배열이어야 함.
    @SelectorParam(() => GoogleCalendarController.prototype.readCalenders)
    @core.TypedParam("calendarId") calendarId: string,
    @core.TypedBody() input: IGoogleCalendar.IReadGoogleCalendarEventInput,
  ): Promise<IGoogleCalendar.IReadGoogleCalendarEventOutput>;

  // Selector 대상 메서드는 최소 아래 리턴값을 지켜야 함.
  @core.TypedRoute.Get()
  public async readCalenders(): Promise<Array<{
    title: string;
    data: string;
  }>>;
}
```

```json
{
  "openapi": "3.0.1",
  "servers": [
    {
      "url": "https://github.com/samchon/nestia",
      "description": "insert your server url"
    }
  ],
  "info": {
    "version": "0.2.0",
    "title": "@wrtn/decorators",
    "description": "",
    "license": {
      "name": "COMMERCIAL"
    }
  },
  "paths": {
    "/connector/google-calendar/{calendarId}/get-events": {
      "get": {
        "tags": [],
        "x-wrtn-icon": "https://typia.io/favicon/android-chrome-192x192.png",
        "parameters": [
          {
            "name": "calendarId",
            "in": "path",
            "schema": {
              "type": "string"
            },
            "description": "",
            "required": true,
            "x-wrtn-selector": {
              "method": "get",
              "path": "/connector/google-calendar"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "something": {
                        "type": "number"
                      },
                      "nothing": {
                        "type": "boolean"
                      },
                      "anything": {
                        "type": "string"
                      }
                    },
                    "nullable": false,
                    "required": ["something", "nothing", "anything"]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/connector/google-calendar": {
      "get": {
        "tags": [],
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "title": {
                        "type": "string"
                      },
                      "data": {
                        "type": "string"
                      }
                    },
                    "nullable": false,
                    "required": ["title", "data"]
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {}
  }
}
```
