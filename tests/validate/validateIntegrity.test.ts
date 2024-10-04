import * as path from "node:path";
import { generateFileHash } from "../../src/hash/generateFileHash";
import { generateHash } from "../../src/hash/generateHash";
import {
  type IntegrityValidationType,
  validateIntegrity,
} from "../../src/validate/validateIntegrity";
import { data, key } from "../data/testData";

describe("validateIntegrity", () => {
  const testFilePath = path.join(__dirname, "../data", "testFile.txt");

  it("should validate data integrity correctly", async () => {
    const hash = generateHash({ data, algorithm: "sha256" });
    const isValid = await validateIntegrity({
      type: "data",
      data,
      expectedHash: hash,
      algorithm: "sha256",
    });
    expect(isValid).toBe(true);
  });

  it("should validate file integrity correctly", async () => {
    const hash = await generateFileHash({
      filePath: testFilePath,
      algorithm: "sha256",
    });
    const isValid = await validateIntegrity({
      type: "file",
      filePath: testFilePath,
      expectedHash: hash,
      algorithm: "sha256",
    });
    expect(isValid).toBe(true);
  });

  it("should validate data integrity with HMAC correctly", async () => {
    const hash = generateHash({ data, algorithm: "sha256", key });
    const isValid = await validateIntegrity({
      type: "data",
      data,
      expectedHash: hash,
      algorithm: "sha256",
      key,
    });
    expect(isValid).toBe(true);
  });

  it("should validate file integrity with HMAC correctly", async () => {
    const hash = await generateFileHash({
      filePath: testFilePath,
      algorithm: "sha256",
      key,
    });
    const isValid = await validateIntegrity({
      type: "file",
      filePath: testFilePath,
      expectedHash: hash,
      algorithm: "sha256",
      key,
    });
    expect(isValid).toBe(true);
  });

  it("should throw an error for invalid type", async () => {
    await expect(
      validateIntegrity({
        type: "invalid" as IntegrityValidationType,
        data,
        expectedHash: "dummyHash",
      }),
    ).rejects.toThrow("Invalid type or missing data/filePath");
  });

  it("should throw an error for missing data", async () => {
    await expect(
      validateIntegrity({
        type: "data",
        expectedHash: "dummyHash",
      }),
    ).rejects.toThrow("Invalid type or missing data/filePath");
  });

  it("should throw an error for missing filePath", async () => {
    await expect(
      validateIntegrity({
        type: "file",
        expectedHash: "dummyHash",
      }),
    ).rejects.toThrow("Invalid type or missing data/filePath");
  });
});
