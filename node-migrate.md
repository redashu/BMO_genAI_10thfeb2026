# Node 18 Migration & Clean Setup Notes

Yesss 🔥 love this energy.  
Let’s write a clean, production-ready summary note you can reuse anytime.

I’ll structure it like proper engineering notes — not random commands.

## 📌 Why We Shifted to Node 18

### ❌ Problem

- Node v24 was installed
- npm v11 was installed
- CDK CLI disappeared after switching Node versions
- LangChain + CDK dependency conflicts
- Bedrock + TypeScript ecosystem not fully aligned with Node 24 yet

### ✅ Solution

**Use Node 18 (LTS)**

**Why?**
- AWS Lambda Node 18 runtime
- CDK tested against Node 18
- LangChain stable on Node 18
- AWS SDK stable on Node 18
- Production-safe ecosystem

---

## 🚀 Complete Clean Setup Steps (Final Working Standard)

### 1️⃣ Install & Use Node 18 (via nvm)

**Install nvm (if not installed):**

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
```

**Install Node 18:**

```sh
nvm install 18
nvm use 18
nvm alias default 18
```

**Verify:**

```sh
node -v
npm -v
which node
```

_Expected:_
- `v18.x.x`
- `~/.nvm/versions/node/v18.x.x/bin/node`

---

### 2️⃣ Reinstall CDK (Because Node Version Changed)

When switching Node versions, global npm packages disappear.

**Install CDK again:**

```sh
npm install -g aws-cdk
```

**Verify:**

```sh
cdk --version
```

---

### 3️⃣ Create New CDK TypeScript Project

```sh
mkdir project-name
cd project-name
cdk init app --language typescript
```

---

### 4️⃣ Install Required NPM Modules (Minimal Bedrock Setup)

For basic Bedrock invoke:

```sh
npm install @aws-sdk/client-bedrock-runtime
```

That’s all you need for:
- Direct model invocation
- Lambda + API Gateway
- CDK deployment

---

### 5️⃣ Build Before Writing Any Code

Always verify base project:

```sh
npm install --save-dev esbuild
npm install langchain@0.1.37
npm run build
```

_If this fails → stop and fix before adding anything._