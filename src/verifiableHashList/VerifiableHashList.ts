import { generateHashedBuffer } from "../utils/hashedBuffer";
import { MerkleTree } from "./MerkleTree";

/**
 * A class representing a verifiable hash list, which extends the {@link MerkleTree} class.
 * It provides methods to `add items` to the list and `verify` the integrity of an item.
 * The list can be serialized and deserialized to/from JSON.
 *
 * @param data - The data to be included in the hash list.
 * @param algorithm - The hashing algorithm to use (default: "sha256").
 *
 * @example
 * import { VerifiableHashList } from "hashtegrity";
 *
 * // Create a verifiable hash list
 * const hashList = new VerifiableHashList(["item1", "item2"]);
 *
 * // Get root hash of the list
 * const rootHash = hashList.getRootHash();
 *
 * // Add an item to the list
 * const rootHash = hashList.addItem("item3");
 *
 * // Verify an item in the list
 * const isValid = hashList.verifyItem("item3", rootHash);
 *
 * // Serialize the hash list
 * const json = hashList.toJSON();
 *
 * // Deserialize the hash list
 * const hashList = VerifiableHashList.fromJSON(json);
 */
export class VerifiableHashList extends MerkleTree {
  constructor(data: unknown[], algorithm = "sha256") {
    const leaves = data.map((item) => generateHashedBuffer(item, algorithm));
    super(leaves, algorithm);
  }

  /**
   * Gets the root hash of the Merkle tree.
   *
   * @returns The root hash as a hexadecimal string.
   */
  getRootHash(): string {
    return this.getRoot().toString("hex");
  }

  /**
   * Adds an item to the hash list and returns the new root hash.
   *
   * @param item - The item to be added.
   * @returns The new root hash as a hexadecimal string.
   */
  addItem(item: unknown): string {
    const leaf = generateHashedBuffer(item, this.algorithm);
    this.addLeaf(leaf);
    return this.getRootHash();
  }

  /**
   * Verifies if an item is part of the hash list given a root hash.
   *
   * @param item - The item to be verified.
   * @param rootHash - The root hash to verify against.
   * @returns True if the item is verified, otherwise false.
   */
  verifyItem(item: unknown, rootHash: string): boolean {
    const leaf = generateHashedBuffer(item, this.algorithm);
    const leafIndex = this.getLeaves().findIndex((l) => l.equals(leaf));

    if (leafIndex === -1) {
      return false;
    }

    const proof = this.generateProof(leafIndex);
    return this.verifyProof(proof, leaf, Buffer.from(rootHash, "hex"));
  }

  /**
   * Serializes the hash list to a JSON string.
   *
   * @returns The JSON string representing the hash list.
   */
  toJSON(): string {
    return this.serialize();
  }

  /**
   * Deserializes a JSON string to create a VerifiableHashList instance.
   *
   * @param json - The JSON string to deserialize.
   * @returns A new VerifiableHashList instance.
   * @throws An error if deserialization fails.
   */
  static fromJSON(json: string): VerifiableHashList {
    try {
      const tree = MerkleTree.deserialize(json);
      const instance = Object.create(VerifiableHashList.prototype);
      Object.assign(instance, tree);
      return instance;
    } catch (error) {
      throw new Error(
        `Failed to deserialize VerifiableHashList: ${(error as Error).message}`,
      );
    }
  }
}
