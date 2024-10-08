import * as fs from "node:fs";
import {
  type DirectoryHashOptions,
  type FileHashOptions,
  generateDirectoryHash,
  generateFileHash,
} from "../hash";

/**
 * Type of the monitored entity, either a `file` or a `directory`.
 */
export type MonitorType = "file" | "directory";

/**
 * Base options for monitoring integrity.
 */
type BaseMonitorIntegrityOptions = {
  /** The type of entity to monitor (file or directory). */
  type: MonitorType;
  /**
   * The expected hash value for integrity verification (optional).
   *
   * If not provided then the hash will be generated initially.
   */
  expectedHash?: string;
  /**
   * Callback function to be called when integrity check fails (optional).
   * If not provided then an error will be thrown.
   *
   * @param error The error that caused the integrity check to fail.
   */
  onIntegrityCheckFailed?: (error: Error) => void;
  /**
   * Callback function to be called on any error (optional).
   * If not provided then the error will be thrown.
   *
   * @param error The error that occurred.
   */
  onError?: (error: unknown) => void;
};

type MonitorFileIntegrityOptions = BaseMonitorIntegrityOptions &
  FileHashOptions & { type: "file" };

type MonitorDirectoryIntegrityOptions = BaseMonitorIntegrityOptions &
  DirectoryHashOptions & { type: "directory" };

/**
 * Options for monitoring integrity.
 *
 * - If type: `file` then {@link FileHashOptions} options are required.
 * - If type: `directory` then {@link DirectoryHashOptions} options are required.
 */
export type MonitorIntegrityOptions =
  | MonitorFileIntegrityOptions
  | MonitorDirectoryIntegrityOptions;

/**
 * Monitors the integrity of a file or directory by generating a hash and comparing it to the expected hash.
 *
 * If the expected hash is not provided then it will be generated initially.
 * The monitoring will continue to watch for changes and recompute the hash for comparison.
 *
 * If the integrity check fails then the `onIntegrityCheckFailed` callback will be called.
 * If an error occurs during monitoring then the `onError` callback will be called.
 *
 * If the callbacks are not provided then the errors will be thrown.
 * The monitoring will continue until the process is terminated.
 *
 * @param options {@link MonitorIntegrityOptions} - The options for monitoring integrity.
 * @returns A promise that resolves when the monitoring is complete.
 *
 * @example
 * import { monitorIntegrity } from "hashtegrity";
 *
 * // Monitor file integrity
 * const options = {
 *   type: "file",
 *   filePath: "path/to/your/file.txt",
 *   algorithm: "sha256",
 *   key: "your-secret-key",
 *   metadata: { custom: "data" },
 *   expectedHash: "4d4f638fd1c15eb71e1c7b46556c6d76cf6cc0cf1961d9e39a5fdc988a22cfe2",
 *   onIntegrityCheckFailed: (error) => {
 *     console.error("Integrity check failed:", error);
 *   },
 *   onError: (error) => {
 *     console.error("Error:", error);
 *   },
 * };
 *
 * try {
 *   await monitorIntegrity(options);
 *   console.log("Monitoring started");
 * } catch (err) {
 *   console.error(err);
 * }
 *
 * // Monitor directory integrity
 * const dirOptions = {
 *   type: "directory",
 *   directoryPath: "path/to/your/directory",
 *   ...options,
 * };
 *
 * try {
 *   await monitorIntegrity(options);
 *   console.log("Monitoring started");
 * } catch (err) {
 *   console.error(err);
 * }
 */
export const monitorIntegrity = async ({
  type,
  expectedHash,
  onIntegrityCheckFailed,
  onError,
  ...hashOptions
}: MonitorIntegrityOptions): Promise<void> => {
  try {
    const computeHash = async () => {
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

      throw new Error(
        `Expected type to be "file" or "directory" but got ${type}`,
      );
    };

    if (!expectedHash) {
      expectedHash = await computeHash();
    }

    const checkIntegrity = async () => {
      try {
        const currentHash = await computeHash();

        if (currentHash !== expectedHash && onIntegrityCheckFailed) {
          const error = new Error(
            `Integrity check failed for ${type}: ${type === "file" ? (hashOptions as MonitorFileIntegrityOptions).filePath : (hashOptions as MonitorDirectoryIntegrityOptions).directoryPath}`,
          );
          if (onIntegrityCheckFailed) {
            onIntegrityCheckFailed(error);
          } else {
            throw error;
          }
        }
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          throw error;
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
