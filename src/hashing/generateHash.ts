import * as crypto from "node:crypto";
import { canonicalize } from "../utils/canonicalize";

export type GenerateHashParams = {
  data: unknown;
  algorithm?: string;
  key?: string;
};

export const generateHash = ({
  data,
  algorithm = "sha256",
  key,
}: GenerateHashParams): string => {
  const hash = key
    ? crypto.createHmac(algorithm, key)
    : crypto.createHash(algorithm);
  hash.update(canonicalize(data));
  return hash.digest("hex");
};
