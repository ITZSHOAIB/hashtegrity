import { VerifiableHashList } from "../../src/verifiableHashList/VerifiableHashList";

describe("VerifiableHashList", () => {
  const data = ["item1", "item2", "item3"];
  const algorithm = "sha256";

  let hashList: VerifiableHashList;

  beforeEach(() => {
    hashList = new VerifiableHashList(data, algorithm);
  });

  it("should get the root hash of the Merkle tree", () => {
    const rootHash = hashList.getRootHash();
    expect(rootHash).toBeDefined();
    expect(rootHash).toHaveLength(64); // sha256 hash length
  });

  it("should add an item to the hash list and return the new root hash", () => {
    const newItem = "item4";
    const newRootHash = hashList.addItem(newItem);
    expect(newRootHash).toBeDefined();
    expect(newRootHash).toHaveLength(64); // sha256 hash length

    // Verify the new item is part of the list
    const isValid = hashList.verifyItem(newItem, newRootHash);
    expect(isValid).toBe(true);
  });

  it("should verify if an item is part of the hash list given a root hash", () => {
    const rootHash = hashList.getRootHash();
    const isValid = hashList.verifyItem("item1", rootHash);
    expect(isValid).toBe(true);
  });

  it("should serialize the state of the hash list to a JSON string", () => {
    const json = hashList.toJSON();
    expect(json).toBeDefined();
    expect(typeof json).toBe("string");

    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty("leaves");
    expect(parsed).toHaveProperty("layers");
    expect(parsed).toHaveProperty("algorithm");
  });

  it("should deserialize a JSON string to create a VerifiableHashList instance", () => {
    const json = hashList.toJSON();
    const deserializedHashList = VerifiableHashList.fromJSON(json);

    expect(deserializedHashList).toBeInstanceOf(VerifiableHashList);
    expect(deserializedHashList.getRootHash()).toBe(hashList.getRootHash());
  });

  it("should throw an error if deserialization fails", () => {
    const invalidJson = '{"invalid": "json"}';
    expect(() => VerifiableHashList.fromJSON(invalidJson)).toThrow(
      "Failed to deserialize VerifiableHashList",
    );
  });
});
