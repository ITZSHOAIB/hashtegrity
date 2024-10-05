import { watch } from "node:fs";
import { type FileHashOptions, generateFileHash } from "../hash";

export type MonitorFileIntegrityOptions = FileHashOptions & {
  expectedHash?: string;
  onIntegrityCheckFailed?: (error: Error) => void;
  onError?: (error: unknown) => void;
};

export const monitorFileIntegrity = async ({
  filePath,
  key,
  algorithm = "sha256",
  metadata = {},
  expectedHash,
  onIntegrityCheckFailed,
  onError,
}: MonitorFileIntegrityOptions): Promise<void> => {
  try {
    if (!expectedHash) {
      expectedHash = await generateFileHash({
        filePath,
        algorithm,
        key,
        metadata,
      });
    }

    const checkIntegrity = async () => {
      try {
        const currentHash = await generateFileHash({
          filePath,
          algorithm,
          key,
          metadata,
        });

        if (currentHash !== expectedHash && onIntegrityCheckFailed) {
          onIntegrityCheckFailed(
            new Error(`Integrity check failed for file: ${filePath}`),
          );
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    };

    watch(filePath, async (eventType) => {
      if (eventType === "change") {
        await checkIntegrity();
      }
    });

    await checkIntegrity();
  } catch (error) {
    if (onError) {
      onError(error);
    }
  }
};
