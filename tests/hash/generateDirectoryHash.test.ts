import * as path from "node:path";
import * as fs from "node:fs";
import { generateDirectoryHash } from "../../src/hash/generateDirectoryHash";
import { generateFileHash } from "../../src/hash/generateFileHash";
import { generateHash } from "../../src/hash/generateHash";

jest.mock("../../src/hash/generateFileHash");
jest.mock("../../src/hash/generateHash");

describe("generateDirectoryHash", () => {
  const testDirPath = path.join(__dirname, "../data/testDir");
  const emptyDirPath = path.join(__dirname, "../data/emptyDir");
  const nonExistentDirPath = path.join(__dirname, "../data/nonExistentDir");

  beforeAll(() => {
    // Create test directories and files
    if (!fs.existsSync(testDirPath)) {
      fs.mkdirSync(testDirPath, { recursive: true });
      fs.writeFileSync(path.join(testDirPath, "file1.txt"), "content1");
      fs.writeFileSync(path.join(testDirPath, "file2.txt"), "content2");
    }
    if (!fs.existsSync(emptyDirPath)) {
      fs.mkdirSync(emptyDirPath, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test directories and files
    if (fs.existsSync(testDirPath)) {
      fs.rmSync(testDirPath, { recursive: true, force: true });
    }
    if (fs.existsSync(emptyDirPath)) {
      fs.rmSync(emptyDirPath, { recursive: true, force: true });
    }
  });

  it("should generate a hash for a directory with default options", async () => {
    (generateFileHash as jest.Mock).mockImplementation(({ filePath }) => {
      return Promise.resolve(`hash-${path.basename(filePath)}`);
    });
    (generateHash as jest.Mock).mockImplementation(({ data }) => {
      return `directory-hash-${data}`;
    });

    const hash = await generateDirectoryHash({
      directoryPath: testDirPath,
    });

    expect(hash).toBeDefined();
    expect(hash).toContain("directory-hash-hash-file1.txthash-file2.txt");
  });

  it("should generate a hash for a directory with a specific algorithm", async () => {
    (generateFileHash as jest.Mock).mockImplementation(({ filePath }) => {
      return Promise.resolve(`md5-hash-${path.basename(filePath)}`);
    });
    (generateHash as jest.Mock).mockImplementation(({ data }) => {
      return `md5-directory-hash-${data}`;
    });

    const hash = await generateDirectoryHash({
      directoryPath: testDirPath,
      algorithm: "md5",
    });

    expect(hash).toBeDefined();
    expect(hash).toContain(
      "md5-directory-hash-md5-hash-file1.txtmd5-hash-file2.txt",
    );
  });

  it("should include the directory structure in the hash", async () => {
    (generateFileHash as jest.Mock).mockImplementation(
      ({ filePath, metadata }) => {
        return Promise.resolve(
          `hash-${path.basename(filePath)}-${metadata.filePath}`,
        );
      },
    );
    (generateHash as jest.Mock).mockImplementation(({ data }) => {
      return `directory-hash-${data}`;
    });

    const hash = await generateDirectoryHash({
      directoryPath: testDirPath,
      includeStructure: true,
    });

    expect(hash).toBeDefined();
    expect(hash).toContain("directory-hash-hash-file1.txt");
    expect(hash).toContain(testDirPath);
  });

  it("should handle non-existent directories", async () => {
    await expect(
      generateDirectoryHash({
        directoryPath: nonExistentDirPath,
      }),
    ).rejects.toThrow(`Directory not found: '${nonExistentDirPath}'`);
  });

  it("should handle empty directories", async () => {
    (generateHash as jest.Mock).mockImplementation(({ data }) => {
      return `directory-hash-${data}`;
    });

    const hash = await generateDirectoryHash({
      directoryPath: emptyDirPath,
    });

    expect(hash).toBeDefined();
    expect(hash).toBe("directory-hash-");
  });

  it("should handle directories with excluded files", async () => {
    (generateFileHash as jest.Mock).mockImplementation(({ filePath }) => {
      return Promise.resolve(`hash-${path.basename(filePath)}`);
    });
    (generateHash as jest.Mock).mockImplementation(({ data }) => {
      return `directory-hash-${data}`;
    });

    const hash = await generateDirectoryHash({
      directoryPath: testDirPath,
      exclude: ["file2.txt"],
    });

    expect(hash).toBeDefined();
    expect(hash).toContain("directory-hash-hash-file1.txt");
    expect(hash).not.toContain("hash-file2.txt");
  });
});
