import {
  type DataHashOptions,
  type DirectoryHashOptions,
  type FileHashOptions,
  generateDirectoryHash,
  generateFileHash,
  generateHash,
} from "../hash";

export type IntegrityValidationType = "data" | "file" | "directory";

export type IntegrityValidationOptions = (
  | Omit<DataHashOptions, "data">
  | Omit<FileHashOptions, "filePath">
  | Omit<DirectoryHashOptions, "directoryPath">
) & {
  type: IntegrityValidationType;
  expectedHash: string;
  data?: unknown;
  filePath?: string;
  directoryPath?: string;
};

export const validateIntegrity = async (
  options: IntegrityValidationOptions,
): Promise<boolean> => {
  const { type, data, filePath, directoryPath, expectedHash, ...hashOptions } =
    options;

  if (type === "data" && data !== undefined) {
    return generateHash({ data, ...hashOptions }) === expectedHash;
  }

  if (type === "file" && filePath !== undefined) {
    const fileHash = await generateFileHash({
      filePath,
      ...hashOptions,
    });
    return fileHash === expectedHash;
  }

  if (type === "directory" && directoryPath !== undefined) {
    const directoryHash = await generateDirectoryHash({
      directoryPath,
      ...hashOptions,
    });
    return directoryHash === expectedHash;
  }

  throw new Error("Invalid type or missing data/filePath");
};
