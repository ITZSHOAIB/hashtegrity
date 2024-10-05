import {
  type DataHashOptions,
  type DirectoryHashOptions,
  type FileHashOptions,
  generateDirectoryHash,
  generateFileHash,
  generateHash,
} from "../hash";

export type IntegrityValidationType = "data" | "file" | "directory";

type BaseIntegrityValidationOptions = {
  type: IntegrityValidationType;
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

    return generateHash({ data, ...restOptions }) === expectedHash;
  }

  if (type === "file") {
    const { filePath, ...restOptions } =
      hashOptions as FileIntegrityValidationOptions;

    const fileHash = await generateFileHash({
      filePath,
      ...restOptions,
    });

    return fileHash === expectedHash;
  }

  if (type === "directory") {
    const { directoryPath, ...restOptions } =
      hashOptions as DirectoryIntegrityValidationOptions;

    const directoryHash = await generateDirectoryHash({
      directoryPath,
      ...restOptions,
    });

    return directoryHash === expectedHash;
  }

  throw new Error("Invalid type or missing data/filePath");
};
