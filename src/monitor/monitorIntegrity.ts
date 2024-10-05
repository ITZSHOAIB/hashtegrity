import * as fs from "node:fs";
import {
  type DirectoryHashOptions,
  type FileHashOptions,
  generateDirectoryHash,
  generateFileHash,
} from "../hash";

export type MonitorType = "file" | "directory";

type BaseMonitorIntegrityOptions = {
  type: MonitorType;
  expectedHash?: string;
  onIntegrityCheckFailed?: (error: Error) => void;
  onError?: (error: unknown) => void;
};

type MonitorFileIntegrityOptions = BaseMonitorIntegrityOptions &
  FileHashOptions & { type: "file" };

type MonitorDirectoryIntegrityOptions = BaseMonitorIntegrityOptions &
  DirectoryHashOptions & { type: "directory" };

export type MonitorIntegrityOptions =
  | MonitorFileIntegrityOptions
  | MonitorDirectoryIntegrityOptions;

export const monitorIntegrity = async ({
  type,
  expectedHash,
  onIntegrityCheckFailed,
  onError,
  ...hashOptions
}: MonitorIntegrityOptions): Promise<void> => {
  try {
    const generateHash = async () => {
      if (type === "file") {
        const { filePath, ...restOptions } =
          hashOptions as MonitorFileIntegrityOptions;

        if (!filePath) {
          throw new Error(
            "File path is required for file integrity monitoring",
          );
        }

        return generateFileHash({ filePath, ...restOptions });
      }

      if (type === "directory") {
        const { directoryPath, ...restOptions } =
          hashOptions as MonitorDirectoryIntegrityOptions;

        if (!directoryPath) {
          throw new Error(
            "Directory path is required for directory integrity monitoring",
          );
        }

        return generateDirectoryHash({
          directoryPath,
          ...restOptions,
        });
      }

      throw new Error("Invalid type");
    };

    if (!expectedHash) {
      expectedHash = await generateHash();
    }

    const checkIntegrity = async () => {
      try {
        const currentHash = await generateHash();

        if (currentHash !== expectedHash && onIntegrityCheckFailed) {
          onIntegrityCheckFailed(
            new Error(
              `Integrity check failed for ${type}: ${type === "file" ? (hashOptions as MonitorFileIntegrityOptions).filePath : (hashOptions as MonitorDirectoryIntegrityOptions).directoryPath}`,
            ),
          );
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    };

    fs.watch(
      type === "file"
        ? (hashOptions as MonitorFileIntegrityOptions).filePath
        : (hashOptions as MonitorDirectoryIntegrityOptions).directoryPath,
      { recursive: type === "directory" },
      async (eventType) => {
        if (
          eventType === "change" ||
          (eventType === "rename" &&
            type === "directory" &&
            (hashOptions as MonitorDirectoryIntegrityOptions).includeStructure)
        ) {
          await checkIntegrity();
        }
      },
    );

    await checkIntegrity();
  } catch (error) {
    if (onError) {
      onError(error);
    }
  }
};
