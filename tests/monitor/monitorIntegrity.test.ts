import * as fs from "node:fs";
import { generateDirectoryHash } from "../../src/hash/generateDirectoryHash";
import { generateFileHash } from "../../src/hash/generateFileHash";
import { monitorIntegrity } from "../../src/monitor/monitorIntegrity";
import { expectedHash, key } from "../fixtures/testData";

jest.mock("node:fs");
jest.mock("../../src/hash/generateFileHash");
jest.mock("../../src/hash/generateHash");
jest.mock("../../src/hash/generateDirectoryHash");

describe("monitorIntegrity", () => {
  const onIntegrityCheckFailed = jest.fn();
  const onError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("file integrity monitoring", () => {
    const filePath = "path/to/file";

    it("should call onIntegrityCheckFailed when integrity check fails", async () => {
      (generateFileHash as jest.Mock).mockResolvedValueOnce(expectedHash);
      (generateFileHash as jest.Mock).mockResolvedValueOnce("modifiedHash");

      // Mock fs.watch to call the callback function
      (fs.watch as jest.Mock).mockImplementation((path, options, callback) => {
        callback("change");
        return {
          close: jest.fn(),
        };
      });

      await monitorIntegrity({
        type: "file",
        filePath,
        key,
        onIntegrityCheckFailed,
        onError,
      });

      expect(onIntegrityCheckFailed).toHaveBeenCalledWith(
        new Error(`Integrity check failed for file: ${filePath}`),
      );
      expect(onError).not.toHaveBeenCalled();
    });

    it("should not call onIntegrityCheckFailed when integrity check passes", async () => {
      (generateFileHash as jest.Mock).mockResolvedValue(expectedHash);

      await monitorIntegrity({
        type: "file",
        filePath,
        expectedHash,
        key,
        onIntegrityCheckFailed,
        onError,
      });

      expect(onIntegrityCheckFailed).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it("should call onError when an error occurs", async () => {
      const error = new Error("Test error");

      (generateFileHash as jest.Mock).mockRejectedValue(error);

      await monitorIntegrity({
        type: "file",
        filePath,
        key,
        onIntegrityCheckFailed,
        onError,
      });

      expect(onError).toHaveBeenCalledWith(error);
      expect(onIntegrityCheckFailed).not.toHaveBeenCalled();
    });
  });

  describe("directory integrity monitoring", () => {
    const directoryPath = "path/to/directory";

    it("should call onIntegrityCheckFailed when integrity check fails", async () => {
      (generateDirectoryHash as jest.Mock).mockResolvedValueOnce("initialHash");
      (generateDirectoryHash as jest.Mock).mockResolvedValueOnce(
        "modifiedHash",
      );

      // Mock fs.watch to call the callback function
      (fs.watch as jest.Mock).mockImplementation((path, options, callback) => {
        callback("change");
        return {
          close: jest.fn(),
        };
      });

      await monitorIntegrity({
        type: "directory",
        directoryPath,
        key,
        onIntegrityCheckFailed,
        onError,
      });

      expect(onIntegrityCheckFailed).toHaveBeenCalledWith(
        new Error(`Integrity check failed for directory: ${directoryPath}`),
      );
      expect(onError).not.toHaveBeenCalled();
    });

    it("should not call onIntegrityCheckFailed when integrity check passes", async () => {
      (generateDirectoryHash as jest.Mock).mockResolvedValue(expectedHash);

      await monitorIntegrity({
        type: "directory",
        directoryPath,
        expectedHash,
        key,
        onIntegrityCheckFailed,
        onError,
      });

      expect(onIntegrityCheckFailed).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it("should call onError when an error occurs", async () => {
      const error = new Error("Test error");

      (generateDirectoryHash as jest.Mock).mockRejectedValue(error);

      await monitorIntegrity({
        type: "directory",
        directoryPath,
        key,
        onIntegrityCheckFailed,
        onError,
      });

      expect(onError).toHaveBeenCalledWith(error);
      expect(onIntegrityCheckFailed).not.toHaveBeenCalled();
    });
  });
});
