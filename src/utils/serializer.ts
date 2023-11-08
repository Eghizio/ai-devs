import fs from "node:fs/promises";

// TODO: Make a serializer for JSON responses to serialize it to a file. Console kinda is not helpful tbh.
export const serialize = (filename: string) => <T>(data: T): T => {
  fs.writeFile(
    `./src/serialized/${filename}_${Date.now()}.json`,
    JSON.stringify(data, null, 2) + "\n",
    { flag: "a", encoding: "utf-8" }
  );

  return data;
};
// could aggregate data and then serialize it to one file.
