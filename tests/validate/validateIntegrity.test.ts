import * as path from "node:path";
import * as fs from "node:fs";
import { generateFileHash } from "../../src/hash/generateFileHash";
import { generateHash } from "../../src/hash/generateHash";
import { validateIntegrity } from "../../src/validate/validateIntegrity";
import { data, key } from "../data/testData";

describe("validateIntegrity", () => {
  const testFilePath = path.join(__dirname, "../data", "testFile.txt");
  const fileContent = "test content";

  beforeAll(() => {
    // Create a test file
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, fileContent);
    }
  });
  afterAll(() => {
    // Clean up the test file
    if (fs.existsSync(testFilePath)) {
      fs.rmSync(testFilePath);
    }
  });

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
});
