import * as fs from "node:fs";
import * as path from "node:path";
import { generateFileHash } from "../../src/hash/generateFileHash";
import { key } from "../fixtures/testData";

describe("generateFileHash", () => {
  const testFilePath = path.join(__dirname, "../fixtures", "testFile.txt");
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

  it("should generate a sha256 hash by default", async () => {
    const hash = await generateFileHash({ filePath: testFilePath });
    expect(hash).toBeDefined();
    expect(hash).toHaveLength(64); // sha256 hash length
  });

  it("should generate a hash using the specified algorithm", async () => {
    const hash = await generateFileHash({
      filePath: testFilePath,
      algorithm: "md5",
    });
    expect(hash).toBeDefined();
    expect(hash).toHaveLength(32); // md5 hash length
  });

  it("should generate a sha256 HMAC by default when key is provided", async () => {
    const hmac = await generateFileHash({ filePath: testFilePath, key });
    expect(hmac).toBeDefined();
    expect(hmac).toHaveLength(64); // sha256 HMAC length
  });

  it("should generate an HMAC using the specified algorithm when key is provided", async () => {
    const hmac = await generateFileHash({
      filePath: testFilePath,
      algorithm: "md5",
      key,
    });
    expect(hmac).toBeDefined();
    expect(hmac).toHaveLength(32); // md5 HMAC length
  });

  it("should throw an error if the file does not exist", async () => {
    const nonExistentFilePath = path.join(__dirname, "nonExistentFile.txt");
    await expect(
      generateFileHash({ filePath: nonExistentFilePath }),
    ).rejects.toThrow(`File not found: ${nonExistentFilePath}`);
  });
});
