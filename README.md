# 🌟 hashtegrity 🌟

**Secure your data with ease!** `hashtegrity` is a powerful library for generating hashes and validating data integrity, ensuring your data remains untampered and secure.

## 🚀 Features

- **Fast and Efficient**: Built with [Bun](https://bun.sh), a super-fast JavaScript runtime.
- **Versatile Hashing**: Supports multiple hashing algorithms like `sha256`, `md5`, and more.
- **HMAC Generation**: Easily generate HMACs for added security.
- **Data Integrity Validation**: Validate the integrity of your data with simple functions.
- **TypeScript Support**: Fully typed for a seamless development experience.

## 📦 Installation

Install the package:

```bash
npm install hashtegrity
```

## 🛠️ Usage

### Generate a Hash

```typescript
import { generateHash } from './dist/index.cjs.js';

const data = { key: 'value', bool: true, num: 42 };
const hash = generateHash(data);
console.log(`Hash: ${hash}`);
```

### Generate an HMAC

```typescript
import { generateHmac } from './dist/index.cjs.js';

const key = 'secret-key';
const hmac = generateHmac(data, key);
console.log(`HMAC: ${hmac}`);
```

### Validate Data Integrity

```typescript
import { validateIntegrity } from './dist/index.cjs.js';

const isValid = validateIntegrity(data, hash);
console.log(`Is data valid? ${isValid}`);
```

## 🧑‍💻 Development Guide

### 🤖 Install Dependencies

Install [Bun](https://bun.sh/) and then dependencies using Bun:

```bash
bun install
```

### 🧪 Running Tests

Run the tests using Jest:

```bash
bun run test
```

## 🤝 Contribution

We welcome contributions! Please see the CONTRIBUTING.md file for detailed guidelines on how to contribute.


## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🌐 Links

- [Bun](https://bun.sh) - The fast all-in-one JavaScript runtime.
- [GitHub Repository](https://github.com/ITZSHOAIB/hashtegrity) - Contribute to the project.

---

Created with ❤️ by Sohab Sk