import * as path from "node:path";
import * as glob from "glob";
import { generateFileHash } from "./generateFileHash";
import { generateHash } from "./generateHash";

export type DirectoryHashOptions = {
  directoryPath: string;
  algorithm?: string;
  include?: string[];
  exclude?: string[];
  key?: string;
  metadata?: Record<string, unknown>;
  includeStructure?: boolean;
};

export const generateDirectoryHash = async (
  options: DirectoryHashOptions,
): Promise<string> => {
  const {
    directoryPath,
    algorithm = "sha256",
    include = ["**/*"],
    exclude = [],
    key,
    metadata = {},
    includeStructure = false,
  } = options;

  const files = glob.sync(include.join(","), {
    cwd: directoryPath,
    ignore: exclude,
    nodir: true,
  });

  const fileHashes = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(directoryPath, file);
      const fileHash = await generateFileHash({
        filePath,
        algorithm,
        key,
        metadata,
      });
      return includeStructure ? `${file}:${fileHash}` : fileHash;
    }),
  );

  return generateHash({ data: fileHashes.join(""), algorithm, key, metadata });
};
