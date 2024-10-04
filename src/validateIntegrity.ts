import { generateFileHash } from "./hashing";
import { generateHash } from "./hashing/generateHash";

export type IntegrityValidationType = "data" | "file";

export type ValidateIntegrityOptions = {
  type: IntegrityValidationType;
  data?: unknown;
  filePath?: string;
  hash: string;
  key?: string;
  algorithm?: string;
  metadata?: Record<string, unknown>;
};

export const validateIntegrity = async ({
  type,
  data,
  filePath,
  hash,
  key,
  algorithm = "sha256",
  metadata = {},
}: ValidateIntegrityOptions): Promise<boolean> => {
  if (type === "data" && data !== undefined) {
    return generateHash({ data, algorithm, key, metadata }) === hash;
  }
  if (type === "file" && filePath !== undefined) {
    const fileHash = await generateFileHash({
      filePath,
      algorithm,
      key,
      metadata,
    });
    return fileHash === hash;
  }
  throw new Error("Invalid type or missing data/filePath");
};
