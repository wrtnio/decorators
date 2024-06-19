import { tags } from "typia";

export interface IGoogleCalendar {
  title: string;
  data: string;
  url: string & tags.ContentMediaType<"image/png">;
}
