# 🌟 Hashtegrity 🌟

**Secure your data with ease!** `Hashtegrity` is a powerful library for generating hashes and validating data integrity, ensuring your data remains untampered and secure.

## 🚀 Features

- **Fast and Efficient**: Built with [pnpm](https://pnpm.io/), a fast and efficient package manager.
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
import { generateHash } from 'hashtegrity';

const data = { key: 'value', bool: true, num: 42 };
const hash = generateHash({ data });
console.log(`Hash: ${hash}`);
```

### Generate an HMAC

```typescript
import { generateHash } from 'hashtegrity';

const key = 'secret-key';
const hmac = generateHash({ data, key });
console.log(`HMAC: ${hmac}`);
```

### Validate Data Integrity

```typescript
import { validateIntegrity } from 'hashtegrity';

const isValid = validateIntegrity({ data, hash });
console.log(`Is data valid? ${isValid}`);
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
