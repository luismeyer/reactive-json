import { resolve } from "path";
import { createInterface } from "readline";

import { reactiveJSON } from "../lib/index";

const cli = createInterface({
  input: process.stdin,
  output: process.stdout,
});

type Json = {
  foo: string;
  bar: string;
};

const jsonPath = resolve(__dirname, "./storage.json");
const json = reactiveJSON<Json>(jsonPath, { bar: "foo", foo: "bar" });

const handleStop = (input: string) => {
  if (input !== "stop") {
    return;
  }

  cli.close();
  process.exit(0);
};

const main = () => {
  cli.write("Reactive JSON test. Write 'stop' to end the script.\n");

  cli.write(`JSON value is: ${JSON.stringify(json)}\n`);

  cli.question("Which key do you want to set (foo or bar)? ", (key) => {
    handleStop(key);

    cli.question(`Which value should '${key}' be? `, (value) => {
      if (key !== "foo" && key !== "bar") {
        return;
      }

      handleStop(value);

      json[key] = value;

      main();
    });
  });
};

main();
