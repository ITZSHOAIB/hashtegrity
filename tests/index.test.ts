import { generateHash, generateHmac, validateIntegrity } from "../src/index";

describe("hashtegrity", () => {
  const data = {
    key: "value",
    array: [1, 2, 3],
    bool: true,
    num: 42,
    obj: { nested: "property", another: "value" },
  };

  const anotherData = {
    bool: true,
    num: 42,
    array: [1, 2, 3],
    obj: { nested: "property", another: "value" },
    key: "value",
  };

  const key = "secret-key";

  describe("generateHash", () => {
    it("should generate a sha256 hash by default", () => {
      const hash = generateHash(data);
      expect(hash).toBeDefined();
      expect(hash).toHaveLength(64); // sha256 hash length
    });

    it("should generate a hash using the specified algorithm", () => {
      const hash = generateHash(data, "md5");
      expect(hash).toBeDefined();
      expect(hash).toHaveLength(32); // md5 hash length
    });
    it("should generate the same hash for objects with the same values but different key order", () => {
      const hash1 = generateHash(data);
      const hash2 = generateHash(anotherData);
      expect(hash1).toBe(hash2);
    });
  });

  describe("generateHmac", () => {
    it("should generate a sha256 HMAC by default", () => {
      const hmac = generateHmac(data, key);
      expect(hmac).toBeDefined();
      expect(hmac).toHaveLength(64); // sha256 HMAC length
    });

    it("should generate an HMAC using the specified algorithm", () => {
      const hmac = generateHmac(data, key, "md5");
      expect(hmac).toBeDefined();
      expect(hmac).toHaveLength(32); // md5 HMAC length
    });
    it("should generate the same HMAC for objects with the same values but different key order", () => {
      const hmac1 = generateHmac(data, key);
      const hmac2 = generateHmac(anotherData, key);
      expect(hmac1).toBe(hmac2);
    });
  });

  describe("validateIntegrity", () => {
    it("should validate a sha256 hash by default", () => {
      const hash = generateHash(data);
      const isValid = validateIntegrity(data, hash);
      expect(isValid).toBe(true);
    });

    it("should validate a hash using the specified algorithm", () => {
      const hash = generateHash(data, "md5");
      const isValid = validateIntegrity(data, hash, "md5");
      expect(isValid).toBe(true);
    });

    it("should validate a sha256 HMAC by default", () => {
      const hmac = generateHmac(data, key);
      const isValid = validateIntegrity(data, hmac, "sha256", key);
      expect(isValid).toBe(true);
    });

    it("should validate an HMAC using the specified algorithm", () => {
      const hmac = generateHmac(data, key, "md5");
      const isValid = validateIntegrity(data, hmac, "md5", key);
      expect(isValid).toBe(true);
    });
  });
});
