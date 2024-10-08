import * as crypto from "node:crypto";
import { canonicalize } from "../utils/canonicalize";

/**
 * Options for generating a data hash.
 */
export type DataHashOptions = {
  /** The data to be hashed. The complexity of data can be anything. */
  data: unknown;
  /** The hashing algorithm to use (default: "sha256"). */
  algorithm?: string;
  /** The key to use for HMAC (optional). */
  key?: string;
  /** Additional metadata to include in the hash. */
  metadata?: Record<string, unknown>;
};

/**
 * Generates a cryptographic hash or HMAC for the given data of any complext structure.
 *
 * @param options {@link DataHashOptions} - The options for generating the hash.
 * @returns The generated hash as a hexadecimal string.
 *
 * @example
 * import { generateHash } from "hashtegrity";
 *
 * // Generate a SHA-256 hash
 * const hash = generateHash({ data: "Hello, world!" });
 * // Generate an HMAC using a key
 * const hmac = generateHash({ data: "Hello, world!", key: "secret-key" });
 */
export const generateHash = ({
  data,
  key,
  algorithm = "sha256",
  metadata = {},
}: DataHashOptions): string => {
  const hash = key
    ? crypto.createHmac(algorithm, key)
    : crypto.createHash(algorithm);

  hash.update(canonicalize({ data, metadata }));

  return hash.digest("hex");
};
