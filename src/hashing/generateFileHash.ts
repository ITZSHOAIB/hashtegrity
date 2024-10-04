import * as fs from "node:fs";
import { generateHash } from "./generateHash";

export type GenerateFileHashParams = {
  filePath: string;
  algorithm?: string;
  key?: string;
};

export const generateFileHash = ({
  filePath,
  algorithm = "sha256",
  key,
}: GenerateFileHashParams): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = fs.createReadStream(filePath);

    stream.on("data", (data: Buffer) => chunks.push(data));
    stream.on("end", () => {
      const data = Buffer.concat(chunks);
      resolve(generateHash({ data, algorithm, key }));
    });
    stream.on("error", (err) => reject(err));
  });
};
