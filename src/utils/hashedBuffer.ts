import { generateHash } from "../hash/generateHash";

export const generateHashedBuffer = (
  data: unknown,
  algorithm: string,
): Buffer => {
  try {
    const hash = generateHash({ data, algorithm });
    return Buffer.from(hash, "hex");
  } catch (error) {
    throw new Error(
      `Failed to generate hashed buffer: ${(error as Error).message}`,
    );
  }
};
