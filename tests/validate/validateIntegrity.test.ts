import { generateDirectoryHash } from "../../src/hash";
import { generateFileHash } from "../../src/hash/generateFileHash";
import { generateHash } from "../../src/hash/generateHash";
import { validateIntegrity } from "../../src/validate/validateIntegrity";
import { data, key } from "../data/testData";

jest.mock("../../src/hash/generateFileHash");
jest.mock("../../src/hash/generateHash");
jest.mock("../../src/hash/generateDirectoryHash");

describe("validateIntegrity", () => {
  const filePath = "test-file.txt";
  const directoryPath = "test-dir";
  const expectedHash = "expected-file-hash";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("data integrity validation", () => {
    it("should return true if the data hash matches the expected hash", async () => {
      (generateHash as jest.Mock).mockReturnValue(expectedHash);

      const isValid = await validateIntegrity({
        type: "data",
        data,
        expectedHash,
      });

      expect(isValid).toBe(true);
      expect(generateHash).toHaveBeenCalledWith({ data });
    });

    it("should return false if the data hash does not match the expected hash", async () => {
      (generateHash as jest.Mock).mockReturnValue("different-hash");

      const isValid = await validateIntegrity({
        type: "data",
        data,
        expectedHash,
      });

      expect(isValid).toBe(false);
      expect(generateHash).toHaveBeenCalledWith({ data });
    });
  });

  describe("file integrity validation", () => {
    it("should return true if the file hash matches the expected hash", async () => {
      (generateFileHash as jest.Mock).mockResolvedValue(expectedHash);

      const isValid = await validateIntegrity({
        type: "file",
        filePath,
        expectedHash,
      });

      expect(isValid).toBe(true);
      expect(generateFileHash).toHaveBeenCalledWith({
        filePath,
      });
    });

    it("should return false if the file hash does not match the expected hash", async () => {
      (generateFileHash as jest.Mock).mockResolvedValue("different-hash");

      const isValid = await validateIntegrity({
        type: "file",
        filePath,
        expectedHash,
      });

      expect(isValid).toBe(false);
      expect(generateFileHash).toHaveBeenCalledWith({
        filePath,
      });
    });
  });

  describe("directory integrity validation", () => {
    it("should return true if the directory hash matches the expected hash", async () => {
      (generateDirectoryHash as jest.Mock).mockResolvedValue(expectedHash);

      const isValid = await validateIntegrity({
        type: "directory",
        directoryPath,
        key,
        includeStructure: true,
        expectedHash,
      });

      expect(isValid).toBe(true);
      expect(generateDirectoryHash).toHaveBeenCalledWith({
        directoryPath,
        key,
        includeStructure: true,
      });
    });

    it("should return false if the directory hash does not match the expected hash", async () => {
      (generateDirectoryHash as jest.Mock).mockResolvedValue("different-hash");

      const isValid = await validateIntegrity({
        type: "directory",
        directoryPath,
        key,
        includeStructure: true,
        expectedHash,
      });

      expect(isValid).toBe(false);
      expect(generateDirectoryHash).toHaveBeenCalledWith({
        directoryPath,
        key,
        includeStructure: true,
      });
    });
  });
});
