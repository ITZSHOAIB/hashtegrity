import { generateHash } from "./hashing/generateHash";

export type ValidateIntegrityParams = {
  data: unknown;
  hash: string;
  algorithm?: string;
  key?: string;
};

export const validateIntegrity = ({
  data,
  hash,
  algorithm = "sha256",
  key,
}: ValidateIntegrityParams): boolean => {
  return generateHash({ data, algorithm, key }) === hash;
};
