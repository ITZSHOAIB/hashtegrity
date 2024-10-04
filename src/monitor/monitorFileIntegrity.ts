import { watch } from "node:fs";
import { generateFileHash } from "../hash";

export type MonitorFileIntegrityOptions = {
  filePath: string;
  algorithm?: string;
  key?: string;
  metadata?: Record<string, unknown>;
  expectedHash?: string;
  onIntegrityCheckFailed?: (error: Error) => void;
  onError?: (error: unknown) => void;
};

export const monitorFileIntegrity = async ({
  filePath,
  algorithm = "sha256",
  key,
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
