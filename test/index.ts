import { TestValidator } from "@nestia/e2e";
import cp from "child_process";
import fs from "fs";

const main = () => {
  cp.execSync("npx nestia swagger");

  const swagger = JSON.parse(
    fs.readFileSync(`${__dirname}/swagger.json`, "utf8"),
  );
  TestValidator.equals("x-wrtn-icon")(
    swagger.paths["/connector/google-calendar/{calendarId}/get-events"].get[
      "x-wrtn-icon"
    ],
  )("https://typia.io/favicon/android-chrome-192x192.png");
  TestValidator.equals("x-wrtn-selector")(
    swagger.paths["/connector/google-calendar/{calendarId}/get-events"].get
      .parameters[0]["x-wrtn-selector"],
  )({
    path: "/connector/google-calendar",
    method: "get",
  });
  TestValidator.equals("x-wrtn-placeholder")(
    swagger.paths["/connector/google-calendar/{calendarId}/get-events"].get
      .parameters[0].schema["x-wrtn-placeholder"],
  )("Select a calendar to read events from.");
  TestValidator.equals("check-exist-header")(
    swagger.paths["/connector/google-calendar/{calendarId}/get-events"].get
      .parameters[1].schema.$ref,
  )("#/components/schemas/IAuthHeaders");
  TestValidator.equals("check-header-type")(
    swagger.components.schemas.IAuthHeaders.properties.secretKey[
      "x-wrtn-secret-key"
    ],
  )("Google");
};
main();
