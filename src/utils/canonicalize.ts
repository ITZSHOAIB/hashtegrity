/**
 * Canonicalizes or serializes the given data into a string format.
 * This function converts various data types into a consistent string representation.
 *
 * @param data - Any type of data to be canonicalized/serialized.
 * @returns The canonicalized string representation of the data.
 *
 */
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

  if (Buffer.isBuffer(data)) {
    return data.toString("hex");
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
