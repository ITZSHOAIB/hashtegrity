import * as fs from "node:fs";
import * as path from "node:path";
import { globSync } from "fast-glob";
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

  const patterns = [...include, ...exclude.map((pattern) => `!${pattern}`)];

  const files = globSync(patterns, {
    cwd: directoryPath,
    dot: true,
    onlyFiles: true,
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
