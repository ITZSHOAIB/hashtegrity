import * as fs from "node:fs";
import * as path from "node:path";
import * as glob from "glob";
import { generateFileHash } from "./generateFileHash";
import { generateHash } from "./generateHash";

export type DirectoryHashOptions = {
  directoryPath: string;
  algorithm?: string;
  key?: string;
  include?: string[];
  exclude?: string[];
  metadata?: Record<string, unknown>;
  includeStructure?: boolean;
};

export const generateDirectoryHash = async ({
  directoryPath,
  algorithm,
  key,
  metadata,
  include = ["**/*"],
  exclude = [],
  includeStructure = false,
}: DirectoryHashOptions): Promise<string> => {
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`Directory not found: '${directoryPath}'`);
  }

  const files = glob.sync(include.join(","), {
    cwd: directoryPath,
    ignore: exclude,
    nodir: true,
  });

  files.sort();

  const fileHashes = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(directoryPath, file);

      const fileMetadata = includeStructure
        ? { ...metadata, filePath }
        : metadata;

      const fileHash = await generateFileHash({
        filePath,
        algorithm,
        key,
        metadata: fileMetadata,
      });

      return fileHash;
    }),
  );

  return generateHash({ data: fileHashes.join(""), algorithm, key, metadata });
};
