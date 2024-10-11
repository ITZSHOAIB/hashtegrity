# 🌟 Hashtegrity 🌟

**Secure your data with ease!** `Hashtegrity` is a powerful library for generating hashes and validating data integrity, ensuring your data remains untampered and secure.

## 🚀 Features

- **Verifiable Hash List**: Create and verify **Merkle trees** for large list of data. Generate proof and verify efficiently.
- **Versatile Hashing**: Supports multiple hashing algorithms like `sha256`, `md5`, and more.
- **HMAC Generation**: Easily generate HMACs for added security.
- **Data Integrity Validation**: Validate the integrity of your data with simple functions.
- **File Integrity Validation**: Validate the integrity of your file easily.
- **File Integrity Monitoring**: Monitor file changes and validate integrity in real-time.
- **TypeScript Support**: Fully typed for a seamless development experience.

## 📦 Installation

Install the package:

```bash
npm install hashtegrity
```

## 🛠️ Usage

### VerifiableHashList 

The `VerifiableHashList` feature allows you to create and verify Merkle trees for data integrity. This is particularly useful for ensuring the integrity of a list of items very efficiently.

```typescript
import { VerifiableHashList } from "hashtegrity";

// Create a verifiable hash list
const hashList = new VerifiableHashList(["item1", "item2"]);

// Get the root hash of the Merkle tree
// **Which can be stored onchain
const rootHash = hashList.getRootHash();
console.log("Root Hash:", rootHash);

// Add an item to the list
const newRootHash = hashList.addItem("item3");
console.log("New Root Hash:", newRootHash);

// Verify an item in the list
const isValid = hashList.verifyItem("item3", newRootHash);
console.log("Is Valid:", isValid);

// Serialize the hash list into JSON
// **can be stored offchain
const json = hashList.toJSON();
console.log("Serialized Hash List:", json);

// Deserialize the hash list and again convert into VerifiableHashList instance
const deserializedHashList = VerifiableHashList.fromJSON(json);
console.log("Deserialized Root Hash:", 
  deserializedHashList.getRootHash()
);
```

### Generate a Hash

```typescript
import { generateHash } from "hashtegrity";

const hash = generateHash({ data: { key: "value" }, algorithm: "sha256" });
```

### Generate an HMAC

```typescript
import { generateHash } from "hashtegrity";

const hmac = generateHash({
  data: "message",
  key: "secret-key",
  algorithm: "sha256",
});
```

### Generate a File Hash

```typescript
import { generateFileHash } from "hashtegrity";

const hash = await generateFileHash({
  filePath: "path/to/your/file.txt",
  algorithm: "sha256",
});
```

### Generate Directory Hash

```typescript
import { generateDirectoryHash } from 'hashtegrity';

const hash = await generateDirectoryHash({
  directoryPath: "path/to/directory",
});
```

### Validate Data Integrity

```typescript
import { validateIntegrity } from 'hashtegrity';

const isValid = await validateIntegrity({
  type: "data",
  data: "your-data-of-any-type",
  expectedHash: "4d4f638fd1c15eb71e1c7b46556c6d76cf6cc0cf1961d9e39a5fdc988a22cfe2",
  algorithm: "sha256",
});
```

### Validate File Integrity

```typescript
import { validateIntegrity } from 'hashtegrity';

const isValid = await validateIntegrity({
  type: "file",
  filePath: "path/to/your/file.txt",
  expectedHash: "4d4f638fd1c15eb71e1c7b46556c6d76cf6cc0cf1961d9e39a5fdc988a22cfe2",
  algorithm: "sha256",
});
```

### Validate Directory Integrity

```typescript
import { validateIntegrity } from 'hashtegrity';

const isValid = await validateIntegrity({
  type: "directory",
  filePath: "path/to/your/directory",
  expectedHash: "4d4f638fd1c15eb71e1c7b46556c6d76cf6cc0cf1961d9e39a5fdc988a22cfe2",
  algorithm: "sha256",
});
```

### Monitor File Integrity

```typescript
import { monitorIntegrity } from 'hashtegrity';

const options = {
  type: "file",
  filePath: "path/to/your/file.txt",
  algorithm: "sha256",
  key: "your-secret-key",
  metadata: { custom: "data" },
  expectedHash:
    "4d4f638fd1c15eb71e1c7b46556c6d76cf6cc0cf1961d9e39a5fdc988a22cfe2",
  onIntegrityCheckFailed: (error) => {
    console.error("Integrity check failed:", error);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
};

await monitorIntegrity(options);
console.log("Monitoring started");
```

### Monitor Directory Integrity

```typescript
import { monitorIntegrity } from 'hashtegrity';

const options = {
  type: "directory",
  filePath: "path/to/your/directory",
  algorithm: "sha256",
  key: "your-secret-key",
  metadata: { custom: "data" },
  expectedHash:
    "4d4f638fd1c15eb71e1c7b46556c6d76cf6cc0cf1961d9e39a5fdc988a22cfe2",
  onIntegrityCheckFailed: (error) => {
    console.error("Integrity check failed:", error);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
};

await monitorIntegrity(options);
console.log("Monitoring started");
```

## 🤝 Contribution

We welcome contributions! Please see the [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for detailed guidelines on how to contribute.


## 📜 License

This project is licensed under the MIT License. See the [LICENSE file](/LICENSE) for details.


---

Created with ❤️ by Sohab Sk
