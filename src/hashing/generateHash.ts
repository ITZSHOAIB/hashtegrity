import * as crypto from "node:crypto";
import { canonicalize } from "../utils/canonicalize";

export type GenerateHashOptions = {
  data: unknown;
  key?: string;
  algorithm?: string;
  metadata?: Record<string, unknown>;
};

export const generateHash = ({
  data,
  key,
  algorithm = "sha256",
  metadata = {},
}: GenerateHashOptions): string => {
  const hash = key
    ? crypto.createHmac(algorithm, key)
    : crypto.createHash(algorithm);
  hash.update(canonicalize({ data, metadata }));
  return hash.digest("hex");
};
