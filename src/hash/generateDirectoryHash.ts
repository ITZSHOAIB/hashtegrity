import * as fs from "node:fs";
import * as path from "node:path";
import { globSync } from "fast-glob";
import { generateFileHash } from "./generateFileHash";
import { generateHash } from "./generateHash";

/**
 * Options for generating a directory hash.
 */
export type DirectoryHashOptions = {
  /** The path to the directory to be hashed. */
  directoryPath: string;
  /** The hashing algorithm to use (default: "sha256"). */
  algorithm?: string;
  /** The key to use for HMAC (optional). */
  key?: string;
  /** Glob patterns to include files. */
  include?: string[];
  /** Glob patterns to exclude files. */
  exclude?: string[];
  /** Additional metadata to include in the hash. */
  metadata?: Record<string, unknown>;
  /** Whether to include the directory structure in the hash. */
  includeStructure?: boolean;
};

/**
 * Generates a cryptographic hash or HMAC for the contents of a directory.
 *
 * @param options {@link DirectoryHashOptions} - The options for generating the directory hash.
 * @returns A promise that resolves to the generated hash as a hexadecimal string.
 *
 * @example
 * import { generateDirectoryHash } from "hashtegrity";
 *
 * // Generate a SHA-256 hash for a directory
 * const hash = await generateDirectoryHash({
 *   directoryPath: "path/to/your/directory",
 * });
 * // Generate an HMAC for a directory using a key
 * const hmac = await generateDirectoryHash({
 *   directoryPath: "path/to/your/directory",
 *   key: "secret
 * });
 */
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

async function abc() {}
