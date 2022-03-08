const readline = require("readline");
const path = require("path");
const { reactiveJSON } = require("../lib/index");

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

cli.write("Reactive JSON test. Write 'stop' to end the script.\n");

const json = reactiveJSON(path.resolve(__dirname, "./storage.json"));

const handleStop = (input) => {
  if (input !== "stop") {
    return;
  }

  cli.close();
  process.exit(0);
};

const main = () => {
  cli.write(`JSON value is: ${JSON.stringify(json)}\n`);

  cli.question("Which key do you want to set? ", (key) => {
    handleStop(key);

    cli.question(`Which value should '${key}' be? `, (value) => {
      handleStop(value);

      json[key] = value;

      main();
    });
  });
};

main();
