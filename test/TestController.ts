import { TypedBody, TypedHeaders, TypedParam, TypedRoute } from "@nestia/core";
import { tags } from "typia";

import { Controller } from "@nestjs/common";
import {
  Placeholder,
  Prerequisite,
  RouteIcon,
  SecretKey,
  SelectorParam,
  Standalone,
} from "../src";
import { IGoogleCalendar } from "./IGoogleCalendar";

@Controller("connector/google-calendar")
export class GoogleCalendarController {
  @RouteIcon("https://typia.io/favicon/android-chrome-192x192.png")
  @TypedRoute.Get("/:calendarId/get-events")
  public async readEvents(
    @SelectorParam(() => GoogleCalendarController.prototype.readCalenders)
    @TypedParam("calendarId")
    calendarId: string & Placeholder<"Select a calendar to read events from.">,
    @TypedHeaders() Authorization: IAuthHeaders,
  ): Promise<
    Array<{
      something: number;
      nothing: boolean;
      anything: string;
    }>
  > {
    Authorization;
    calendarId;
    return [
      {
        something: 1,
        nothing: false,
        anything: "abcd",
      },
    ];
  }

  @RouteIcon("https://typia.io/favicon/android-chrome-192x192.png")
  @Standalone()
  @TypedRoute.Get()
  public async readCalenders(): Promise<IGoogleCalendar[]> {
    return [
      {
        title: "something",
        data: "nothing",
        url: "https://typia.io/logo.png",
      },
    ];
  }

  @TypedRoute.Post("/prerequisite/:url1/:url2")
  public async prerequisite(
    @Prerequisite({
      neighbor: () => GoogleCalendarController.prototype.readCalenders,
      jmesPath: "[].{value: url, label: title}",
    })
    @TypedParam("url1")
    arraiedUrl: string & tags.ContentMediaType<"image/png">,
    @Prerequisite({
      neighbor: () => GoogleCalendarController.prototype.readCalenders,
      jmesPath: "[].{value: url, label: title}",
    })
    @TypedParam("url2")
    soleUrl: string & tags.ContentMediaType<"image/png">,
    @TypedBody()
    input: IUrlRequestBody,
  ): Promise<void> {
    arraiedUrl;
    soleUrl;
    input;
  }
}
export interface IAuthHeaders {
  secretKey: string & SecretKey<"Google">;
}

export interface IUrlRequestBody {
  url: string &
    tags.ContentMediaType<"image/png"> &
    Prerequisite<{
      method: "get";
      path: "/connector/google-calendar";
      jmesPath: "[].{value: url, label: title}";
    }>;
}
