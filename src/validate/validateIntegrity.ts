import {
  type DataHashOptions,
  type DirectoryHashOptions,
  type FileHashOptions,
  generateDirectoryHash,
  generateFileHash,
  generateHash,
} from "../hash";

export type ValidationType = "data" | "file" | "directory";

type BaseIntegrityValidationOptions = {
  type: ValidationType;
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

export type IntegrityValidationOptions =
  | DataIntegrityValidationOptions
  | FileIntegrityValidationOptions
  | DirectoryIntegrityValidationOptions;

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
