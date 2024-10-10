import { generateHashedBuffer } from "../utils/hashedBuffer";

type ProofNode = { node: Buffer; isRightNode: boolean };

/**
 * Class representing a Merkle Tree.
 * A Merkle Tree is a binary tree where each leaf node is a hash of a data block,
 * and each non-leaf node is a hash of its children.
 *
 * @param leaves - The leaves of the Merkle Tree.
 * @param algorithm - The hashing algorithm to use (default: "sha256").
 */
export class MerkleTree {
  private leaves: Buffer[];
  private layers: Buffer[][];
  protected algorithm: string;

  constructor(leaves: Buffer[], algorithm = "sha256") {
    this.algorithm = algorithm;
    this.leaves = leaves;
    this.layers = [this.leaves];
    this.buildTree();
  }

  /**
   * Builds the Merkle Tree by creating layers from the leaves.
   */
  private buildTree(): void {
    let currentLayer = this.leaves;
    while (currentLayer.length > 1) {
      currentLayer = this.createNextLayer(currentLayer);
      this.layers.push(currentLayer);
    }
  }

  /**
   * Creates the next layer of the Merkle Tree from the current layer.
   *
   * @param layer - The current layer of the Merkle Tree.
   * @returns The next layer of the Merkle
   */
  private createNextLayer(layer: Buffer[]): Buffer[] {
    const nextLayer: Buffer[] = [];

    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1] || left;

      nextLayer.push(
        generateHashedBuffer(Buffer.concat([left, right]), this.algorithm),
      );
    }

    return nextLayer;
  }

  /**
   * Adds a leaf to the Merkle Tree and rebuilds the tree.
   *
   * @param leaf - The leaf to add.
   */
  protected addLeaf(leaf: Buffer): void {
    this.leaves.push(leaf);
    this.layers = [this.leaves];
    this.buildTree();
  }

  /**
   * Gets the root of the Merkle Tree.
   *
   * @returns The root of the Merkle Tree.
   */
  protected getRoot(): Buffer {
    return this.layers.length
      ? this.layers[this.layers.length - 1][0]
      : Buffer.from([]);
  }

  /**
   * Gets the leaves of the Merkle Tree.
   *
   * @returns The leaves of the Merkle Tree.
   */
  protected getLeaves(): Buffer[] {
    return this.leaves;
  }

  /**
   * Generates a proof for a leaf node in the Merkle Tree.
   *
   * @param index - The index of the leaf node.
   * @returns The proof for the leaf node.
   */
  protected generateProof(index: number): ProofNode[] {
    const proof: ProofNode[] = [];
    let layerIndex = 0;
    let nodeIndex = index;

    while (layerIndex < this.layers.length - 1) {
      const layer = this.layers[layerIndex];
      const isRightNode = nodeIndex % 2 === 1;
      const pairIndex = isRightNode ? nodeIndex - 1 : nodeIndex + 1;

      if (pairIndex < layer.length) {
        proof.push({ node: layer[pairIndex], isRightNode });
      }

      nodeIndex = Math.floor(nodeIndex / 2);
      layerIndex++;
    }

    return proof;
  }

  /**
   * Verifies a proof for a given target node and root.
   *
   * @param proof - The proof to verify.
   * @param targetNode - The target node to verify.
   * @param root - The root of the Merkle Tree.
   * @returns True if the proof is valid, otherwise false.
   */
  protected verifyProof(
    proof: ProofNode[],
    targetNode: Buffer,
    root: Buffer,
  ): boolean {
    let hash = targetNode;

    for (const { node, isRightNode } of proof) {
      const data = isRightNode
        ? Buffer.concat([node, hash])
        : Buffer.concat([hash, node]);
      hash = generateHashedBuffer(data, this.algorithm);
    }

    return hash.equals(root);
  }

  /**
   * Serializes the Merkle Tree to a JSON string.
   *
   * @returns The JSON string representing the Merkle Tree.
   */
  protected serialize(): string {
    const leaves = this.leaves.map((leaf) => leaf.toString("hex"));
    const layers = this.layers.map((layer) =>
      layer.map((node) => node.toString("hex")),
    );
    return JSON.stringify({ leaves, layers, algorithm: this.algorithm });
  }

  /**
   * Deserializes a JSON string to a Merkle Tree.
   *
   * @param json - The JSON string representing the Merkle Tree.
   * @returns The Merkle Tree deserialized from the JSON string.
   */
  static deserialize(json: string): MerkleTree {
    const { leaves, layers, algorithm } = JSON.parse(json);
    const bufferLeaves = leaves.map((leaf: string) => Buffer.from(leaf, "hex"));
    const bufferLayers = layers.map((layer: string[]) =>
      layer.map((node: string) => Buffer.from(node, "hex")),
    );

    const tree = Object.create(MerkleTree.prototype);
    tree.leaves = bufferLeaves;
    tree.layers = bufferLayers;
    tree.algorithm = algorithm;
    return tree;
  }
}
