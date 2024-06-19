import { TestValidator } from "@nestia/e2e";
import cp from "child_process";
import fs from "fs";
import typia, { tags } from "typia";

import { IGoogleCalendar } from "./IGoogleCalendar";

const main = () => {
  // READ SWAGGER FILE
  cp.execSync("npx nestia swagger");
  const swagger = JSON.parse(
    fs.readFileSync(`${__dirname}/swagger.json`, "utf8"),
  );

  // ICON
  TestValidator.equals("x-wrtn-icon")(
    swagger.paths["/connector/google-calendar/{calendarId}/get-events"].get[
      "x-wrtn-icon"
    ],
  )("https://typia.io/favicon/android-chrome-192x192.png");

  // PLACEHOLDER
  TestValidator.equals("x-wrtn-placeholder")(
    swagger.paths["/connector/google-calendar/{calendarId}/get-events"].get
      .parameters[0].schema["x-wrtn-placeholder"],
  )("Select a calendar to read events from.");

  // SELECTOR
  TestValidator.equals("x-wrtn-selector")(
    swagger.paths["/connector/google-calendar/{calendarId}/get-events"].get
      .parameters[0]["x-wrtn-selector"],
  )({
    path: "/connector/google-calendar",
    method: "get",
  });

  // SECRET-KEYS
  TestValidator.equals("check-exist-header")(
    swagger.paths["/connector/google-calendar/{calendarId}/get-events"].get
      .parameters[1].schema.$ref,
  )("#/components/schemas/IAuthHeaders");
  TestValidator.equals("check-header-type")(
    swagger.components.schemas.IAuthHeaders.properties.secretKey[
      "x-wrtn-secret-key"
    ],
  )("Google");

  // STANDALONE
  TestValidator.equals("x-wrtn-standalone")(
    swagger.paths["/connector/google-calendar"].get["x-wrtn-standalone"],
  )(true);

  // PRE-REQUISITES
  const calendars = typia.random<
    IGoogleCalendar[] & tags.MinItems<3> & tags.MaxItems<3>
  >();
  TestValidator.equals("@Prerequisite().array")(calendars)(
    new Function(
      "response",
      swagger.paths["/connector/google-calendar/prerequisite/{url1}/{url2}"][
        "post"
      ].parameters[0].schema["x-wrtn-prerequisite"].array,
    )(calendars),
  );
  TestValidator.equals("@Prerequisite().value")(calendars[0].url)(
    new Function(
      "elem",
      "index",
      "array",
      swagger.paths["/connector/google-calendar/prerequisite/{url1}/{url2}"][
        "post"
      ].parameters[1].schema["x-wrtn-prerequisite"].value,
    )(calendars[0], 0, calendars),
  );
  TestValidator.equals("Prerequisite.Props.array")(calendars)(
    new Function(
      "response",
      swagger.components.schemas.IUrlRequestBody.properties.url[
        "x-wrtn-prerequisite"
      ].array,
    )(calendars),
  );
  TestValidator.equals("Prerequisite.Props..value")(calendars[0].url)(
    new Function(
      "elem",
      "index",
      "array",
      swagger.components.schemas.IUrlRequestBody.properties.url[
        "x-wrtn-prerequisite"
      ].value,
    )(calendars[0], 0, calendars),
  );
};
main();
