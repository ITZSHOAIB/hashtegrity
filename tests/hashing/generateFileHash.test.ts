import * as path from "node:path";
import { generateFileHash } from "../../src/hashing/generateFileHash";
import { key } from "../data/testData";

describe("generateFileHash", () => {
  const testFilePath = path.join(__dirname, "../data", "testFile.txt");

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
