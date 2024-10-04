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
