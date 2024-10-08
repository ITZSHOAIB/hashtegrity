import * as fs from "node:fs";
import { generateHash } from "./generateHash";

/**
 * Options for generating a file hash.
 */
export type FileHashOptions = {
  /** The path to the file to be hashed. */
  filePath: string;
  /** The hashing algorithm to use (default: "sha256"). */
  algorithm?: string;
  /** The key to use for HMAC (optional). */
  key?: string;
  /** Additional metadata to include in the hash. */
  metadata?: Record<string, unknown>;
};

/**
 * Generates a cryptographic hash or HMAC for the contents of a file.
 *
 * @param options {@link FileHashOptions} - The options for generating the file hash.
 * @returns A promise that resolves to the generated hash as a hexadecimal string.
 *
 * @example
 * import { generateFileHash } from "hashtegrity";
 *
 * // Generate a SHA-256 hash for a file
 * const hash = await generateFileHash({ filePath: "path/to/your/file.txt" });
 * // Generate an HMAC for a file using a key
 * const hmac = await generateFileHash({
 *   filePath: "path/to/your/file.txt",
 *   key: "secret-key",
 * });
 */
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
