import * as crypto from "node:crypto";

export const canonicalize = (data: unknown): string => {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "number") {
    return data.toString();
  }

  if (typeof data === "boolean") {
    return data.toString();
  }

  if (data instanceof Date) {
    return data.toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(canonicalize).join(",");
  }

  if (typeof data === "object" && data !== null) {
    return Object.entries(data)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}:${canonicalize(value)}`)
      .join(",");
  }

  return "";
};

export const generateHash = (data: unknown, algorithm = "sha256"): string => {
  const hash = crypto.createHash(algorithm);
  hash.update(canonicalize(data));
  return hash.digest("hex");
};

export const generateHmac = (
  data: unknown,
  key: string,
  algorithm = "sha256",
): string => {
  const hmac = crypto.createHmac(algorithm, key);
  hmac.update(canonicalize(data));
  return hmac.digest("hex");
};

export const validateIntegrity = (
  data: unknown,
  hash: string,
  algorithm = "sha256",
  key?: string,
): boolean => {
  if (key) {
    return generateHmac(data, key, algorithm) === hash;
  }
  return generateHash(data, algorithm) === hash;
};
