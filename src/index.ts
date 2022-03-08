import { existsSync, readFileSync, writeFileSync } from "fs";

const readJson = <T>(filepath: string): T => {
  const fileContent = readFileSync(filepath, { encoding: "ascii" });
  return JSON.parse(fileContent);
};

export const reactiveJSON = <T extends Record<any, any>>(
  filepath: string,
  init?: T
): T | {} => {
  if (!existsSync(filepath)) {
    writeFileSync(filepath, JSON.stringify(init ?? {}));
  }

  // this holds the json value during runtime
  let jsonVar = readJson<T>(filepath);

  return new Proxy<T>(jsonVar, {
    get: (target, key, receiver) => Reflect.get(target, key, receiver),

    set: (target, key, value, receiver) => {
      const input = value !== "" ? value : undefined;

      // don't know what to do
      if (typeof key === "symbol") {
        return false;
      }

      // capture the old value before update
      const oldValue = target[key];

      // update the proxy and the object
      const success = Reflect.set(target, key, input, receiver);

      if (success && oldValue !== input) {
        // persist new value in file
        writeFileSync(filepath, JSON.stringify(target));
      }

      return success;
    },
  });
};
