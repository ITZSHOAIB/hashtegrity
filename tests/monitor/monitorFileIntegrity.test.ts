import * as fs from "node:fs";
import { generateFileHash } from "../../src/hash/generateFileHash";
import { monitorFileIntegrity } from "../../src/monitor/monitorFileIntegrity";
import { key } from "../data/testData";

jest.mock("node:fs", () => ({
  ...jest.requireActual("node:fs"),
  watch: jest.fn(),
}));

jest.mock("../../src/hash/generateFileHash");

describe("monitorFileIntegrity", () => {
  const algorithm = "sha256";
  const testFilePath = "mocked-file-path";

  it("should call onIntegrityCheckFailed when integrity check fails", async () => {
    const onIntegrityCheckFailed = jest.fn();
    const onError = jest.fn();

    (generateFileHash as jest.Mock).mockResolvedValueOnce("initialHash");
    (generateFileHash as jest.Mock).mockResolvedValueOnce("modifiedHash");

    await monitorFileIntegrity({
      filePath: testFilePath,
      algorithm,
      key,
      onIntegrityCheckFailed,
      onError,
    });

    // Simulate file change
    const watchCallback = (fs.watch as jest.Mock).mock.calls[0][1];
    watchCallback("change");

    expect(onIntegrityCheckFailed).toHaveBeenCalledWith(
      new Error(`Integrity check failed for file: ${testFilePath}`),
    );
    expect(onError).not.toHaveBeenCalled();
  });

  it("should not call onIntegrityCheckFailed when integrity check passes", async () => {
    const onIntegrityCheckFailed = jest.fn();
    const onError = jest.fn();

    const validHash = "validHash";

    (generateFileHash as jest.Mock).mockResolvedValue(validHash);

    await monitorFileIntegrity({
      filePath: testFilePath,
      expectedHash: validHash,
      algorithm,
      key,
      onIntegrityCheckFailed,
      onError,
    });

    // Simulate file change
    const watchCallback = (fs.watch as jest.Mock).mock.calls[0][1];
    watchCallback("change");

    expect(onIntegrityCheckFailed).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it("should call onError when an error occurs", async () => {
    const onIntegrityCheckFailed = jest.fn();
    const onError = jest.fn();

    (generateFileHash as jest.Mock).mockRejectedValueOnce(
      new Error("File not found"),
    );

    await monitorFileIntegrity({
      filePath: testFilePath,
      algorithm,
      key,
      onIntegrityCheckFailed,
      onError,
    });

    expect(onIntegrityCheckFailed).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should calculate hash for the first time if expectedHash is not provided", async () => {
    const onIntegrityCheckFailed = jest.fn();
    const onError = jest.fn();

    (generateFileHash as jest.Mock).mockResolvedValueOnce("initialHash");
    (generateFileHash as jest.Mock).mockResolvedValueOnce("modifiedHash");

    await monitorFileIntegrity({
      filePath: testFilePath,
      algorithm,
      key,
      onIntegrityCheckFailed,
      onError,
    });

    // Simulate file change
    const watchCallback = (fs.watch as jest.Mock).mock.calls[0][1];
    watchCallback("change");

    expect(onIntegrityCheckFailed).toHaveBeenCalledWith(
      new Error(`Integrity check failed for file: ${testFilePath}`),
    );
    expect(onError).not.toHaveBeenCalled();
  });
});
