import {
  type DataHashOptions,
  type DirectoryHashOptions,
  type FileHashOptions,
  generateDirectoryHash,
  generateFileHash,
  generateHash,
} from "../hash";

/**
 * Type of the entity to validate, either `data`, `file`, or `directory`.
 */
export type ValidationType = "data" | "file" | "directory";

/**
 * Base options for validating integrity.
 */
type BaseIntegrityValidationOptions = {
  /** The type of entity to validate (data, file, or directory). */
  type: ValidationType;
  /** The expected hash value for integrity verification. */
  expectedHash: string;
};

type DataIntegrityValidationOptions = BaseIntegrityValidationOptions &
  DataHashOptions & {
    type: "data";
  };

type FileIntegrityValidationOptions = BaseIntegrityValidationOptions &
  FileHashOptions & {
    type: "file";
  };

type DirectoryIntegrityValidationOptions = BaseIntegrityValidationOptions &
  DirectoryHashOptions & {
    type: "directory";
  };

/**
 * Options for validating integrity.
 * - If type: `data` then {@link DataHashOptions} options are required.
 * - If type: `file` then {@link FileHashOptions} options are required.
 * - If type: `directory` then {@link DirectoryHashOptions} options are required.
 */
export type IntegrityValidationOptions =
  | DataIntegrityValidationOptions
  | FileIntegrityValidationOptions
  | DirectoryIntegrityValidationOptions;

/**
 * Validates the integrity of a data, file, or directory by generating a hash and comparing it to the expected hash.
 *
 * @param options {@link IntegrityValidationOptions} - The options for validating integrity.
 * @returns A promise that resolves to a boolean indicating whether the integrity check passed.
 *
 * @example
 * import { validateIntegrity } from "hashtegrity";
 *
 * // Validate data integrity
 * const options = {
 *   type: "data",
 *   data: "Hello, world!",
 *   expectedHash: "4d4f638fd1c15eb71e1c7b46556c6d76cf6cc0cf1961d9e39a5fdc988a22cfe2",
 *   algorithm: "sha256",
 *   key: "your-secret-key",
 *   metadata: { custom: "data" },
 * };
 *
 * const isValid = await validateIntegrity(options);
 *
 * // Validate file integrity
 * const fileOptions = {
 *   type: "file",
 *   filePath: "path/to/your/file.txt",
 *   ...options,
 * };
 *
 * const isValidFile = await validateIntegrity(fileOptions);
 *
 * // Validate directory integrity
 * const directoryOptions = {
 *   type: "directory",
 *   directoryPath: "path/to/your/directory",
 *   ...options,
 * };
 *
 * const isValidDirectory = await validateIntegrity(directoryOptions);
 */
export const validateIntegrity = async ({
  type,
  expectedHash,
  ...hashOptions
}: IntegrityValidationOptions): Promise<boolean> => {
  if (type === "data") {
    const { data, ...restOptions } =
      hashOptions as DataIntegrityValidationOptions;

    if (!data) {
      throw new Error("Data is required for data integrity validation");
    }

    return generateHash({ data, ...restOptions }) === expectedHash;
  }

  if (type === "file") {
    const { filePath, ...restOptions } =
      hashOptions as FileIntegrityValidationOptions;

    if (!filePath) {
      throw new Error("File path is required for file integrity validation");
    }

    const fileHash = await generateFileHash({
      filePath,
      ...restOptions,
    });

    return fileHash === expectedHash;
  }

  if (type === "directory") {
    const { directoryPath, ...restOptions } =
      hashOptions as DirectoryIntegrityValidationOptions;

    if (!directoryPath) {
      throw new Error(
        "Directory path is required for directory integrity validation",
      );
    }

    const directoryHash = await generateDirectoryHash({
      directoryPath,
      ...restOptions,
    });

    return directoryHash === expectedHash;
  }

  throw new Error("Invalid type or missing data/filePath");
};
