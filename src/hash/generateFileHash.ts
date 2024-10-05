import * as fs from "node:fs";
import { generateHash } from "./generateHash";

export type FileHashOptions = {
  filePath: string;
  algorithm?: string;
  key?: string;
  metadata?: Record<string, unknown>;
};

export const generateFileHash = ({
  filePath,
  algorithm,
  key,
  metadata,
}: FileHashOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}`));
    }
    const chunks: Buffer[] = [];
    const stream = fs.createReadStream(filePath);

    stream.on("data", (data: Buffer) => chunks.push(data));
    stream.on("end", () => {
      const data = Buffer.concat(chunks);
      resolve(generateHash({ data, algorithm, key, metadata }));
    });
    stream.on("error", (err) => reject(err));
  });
};
