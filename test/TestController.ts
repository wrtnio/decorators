import { TypedHeaders, TypedParam, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import {
  SecretKey,
  Placeholder,
  RouteIcon,
  SelectorParam,
  Standalone,
} from "../src";
import { tags } from "typia";

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
    return [];
  }

  @RouteIcon("https://typia.io/favicon/android-chrome-192x192.png")
  @Standalone()
  @TypedRoute.Get()
  public async readCalenders(): Promise<
    Array<{
      title: string;
      data: string;
      url: string & tags.ContentMediaType<"image/png">;
    }>
  > {
    return [];
  }
}
export interface IAuthHeaders {
  secretKey: string & SecretKey<"Google">;
}
