import * as crypto from "node:crypto";
import { canonicalize } from "../utils/canonicalize";

export type DataHashOptions = {
  data: unknown;
  algorithm?: string;
  key?: string;
  metadata?: Record<string, unknown>;
};

export const generateHash = ({
  data,
  key,
  algorithm = "sha256",
  metadata = {},
}: DataHashOptions): string => {
  const hash = key
    ? crypto.createHmac(algorithm, key)
    : crypto.createHash(algorithm);
  hash.update(canonicalize({ data, metadata }));
  return hash.digest("hex");
};
