import { generateHash } from "../../src/hash/generateHash";
import { anotherData, data, key } from "../fixtures/testData";

describe("generateHash", () => {
  it("should generate a sha256 hash by default", () => {
    const hash = generateHash({ data });
    expect(hash).toBeDefined();
    expect(hash).toHaveLength(64); // sha256 hash length
  });

  it("should generate a hash using the specified algorithm", () => {
    const hash = generateHash({ data, algorithm: "md5" });
    expect(hash).toBeDefined();
    expect(hash).toHaveLength(32); // md5 hash length
  });

  it("should generate the same hash for objects with the same values but different key order", () => {
    const hash1 = generateHash({ data });
    const hash2 = generateHash({ data: anotherData });
    expect(hash1).toBe(hash2);
  });

  it("should generate a sha256 HMAC by default when key is provided", () => {
    const hmac = generateHash({ data, key });
    expect(hmac).toBeDefined();
    expect(hmac).toHaveLength(64); // sha256 HMAC length
  });

  it("should generate an HMAC using the specified algorithm when key is provided", () => {
    const hmac = generateHash({ data, algorithm: "md5", key });
    expect(hmac).toBeDefined();
    expect(hmac).toHaveLength(32); // md5 HMAC length
  });

  it("should generate the same HMAC for objects with the same values but different key order when key is provided", () => {
    const hmac1 = generateHash({ data, algorithm: "sha256", key });
    const hmac2 = generateHash({
      data: anotherData,
      algorithm: "sha256",
      key,
    });
    expect(hmac1).toBe(hmac2);
  });
});
