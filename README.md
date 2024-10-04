# 🌟 Hashtegrity 🌟

**Secure your data with ease!** `Hashtegrity` is a powerful library for generating hashes and validating data integrity, ensuring your data remains untampered and secure.

## 🚀 Features

- **Fast and Efficient**: Built with [pnpm](https://pnpm.io/), a fast and efficient package manager.
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

### Validate Data Integrity

```typescript
import { validateIntegrity } from 'hashtegrity';

const isValid = await validateIntegrity({
  type: "data",
  data: "your-data-of-any-type",
  hash: "4d4f638fd1c15eb71e1c7b46556c6d76cf6cc0cf1961d9e39a5fdc988a22cfe2",
  algorithm: "sha256",
});
```

### Validate File Integrity

```typescript
import { validateIntegrity } from 'hashtegrity';

const isValid = await validateIntegrity({
  type: "file",
  filePath: "path/to/your/file.txt",
  hash: "4d4f638fd1c15eb71e1c7b46556c6d76cf6cc0cf1961d9e39a5fdc988a22cfe2",
  algorithm: "sha256",
});
```

### Monitor File Integrity

```typescript
import { monitorFileIntegrity } from 'hashtegrity';

const options = {
  filePath: 'path/to/your/file.txt',
  algorithm: 'sha256',
  key: 'your-secret-key',
  metadata: { custom: 'data' },
  expectedHash: 'expected-file-hash',
  onIntegrityCheckFailed: (error) => {
    console.error('Integrity check failed:', error);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
};

await monitorFileIntegrity(options);
console.log('Monitoring started');
```

## 🧑‍💻 Development Guide

### 🤖 Install Dependencies

Install [pnpm](https://pnpm.io/) and then dependencies using pnpm:

```bash
pnpm install
```

### 🧪 Running Tests

Run the tests using Jest:

```bash
pnpm test
```

## 🤝 Contribution

We welcome contributions! Please see the [CONTRIBUTING.md](https://github.com/ITZSHOAIB/hashtegrity/blob/main/CONTRIBUTING.md) file for detailed guidelines on how to contribute.


## 📜 License

This project is licensed under the MIT License. See the [LICENSE file](https://github.com/ITZSHOAIB/hashtegrity/blob/main/LICENSE) for details.

## 🌐 Links

- [pnpm](https://pnpm.io) - The fast and efficient package manager.
- [GitHub Repository](https://github.com/ITZSHOAIB/hashtegrity) - Contribute to the project.

---

Created with ❤️ by Sohab Sk
