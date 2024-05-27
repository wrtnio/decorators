import { INestiaConfig } from "@nestia/sdk";

export const NESTIA_CONFIG: INestiaConfig = {
  input: ["test/TestController.ts"],
  swagger: {
    output: "test/swagger.json",
    beautify: true,
  },
};
export default NESTIA_CONFIG;
