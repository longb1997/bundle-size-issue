# Bundle Size Comparison: Repack v3 vs v5

This repository demonstrates a significant bundle size regression when upgrading from **Repack v3** to **Repack v5**, comparing different bundler and Module Federation configurations.

## 🔍 Overview

This project compares bundle sizes between two React Native setups:

| Setup         | Bundler | Module Federation | Bundle Size      |
| ------------- | ------- | ----------------- | ---------------- |
| **Repack v3** | Webpack | MF1               | Baseline         |
| **Repack v5** | Rspack  | MF2               | **~3-5x larger** |

## 📊 Key Findings

The upgrade from Repack v3 to v5 results in bundle sizes that are **3-5 times larger** than the previous version, which represents a significant regression in build optimization.

## 🏗️ Project Structure

```
bundlesize/
├── Webpack/     # Repack v3 + Webpack + MF1 setup
└── Rspack/      # Repack v5 + Rspack + MF2 setup
```

Both directories contain identical React Native applications to ensure fair comparison:

- Same React Native version
- Same application code (`App.tsx`)
- Same dependencies (where compatible)
- Only bundler configuration differs

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- React Native development environment
- iOS/Android development tools (for mobile testing)

### Running the Webpack Setup (Repack v3)

```bash
cd Webpack
npm install
# or
yarn install

# For development
npm start
# or
yarn start
```

### Running the Rspack Setup (Repack v5)

```bash
cd Rspack
npm install
# or
yarn install

# For development
npm start
# or
yarn start
```

## 📏 Measuring Bundle Size

### Development Bundles

1. Start the bundler in each setup
2. Build the development bundle
3. Compare the generated bundle sizes

### Production Bundles

```bash
# Webpack setup
cd Webpack
yarn bundle

# Rspack setup
cd Rspack
yarn bundle
```

## 🔧 Configuration Files

### Webpack Setup (v3)

- `webpack.config.mjs` - Main webpack configuration
- `webpack.prod.mjs` - Production-specific configuration
- Module Federation v1 configuration

### Rspack Setup (v5)

- `rspack.config.mjs` - Main rspack configuration
- Module Federation v2 configuration

## 📈 Bundle Analysis

To analyze bundle contents and identify size contributors:

### Rspack Bundle Analyzer

```bash
cd Rspack
yarn analyze
# Use appropriate rspack analysis tools
```

## 🐛 Issue Details

- **Expected**: Similar or improved bundle sizes with v5
- **Actual**: 3-5x increase in bundle size
- **Impact**: Significantly larger app downloads and slower load times
- **Environment**: React Native with Module Federation

## 📝 Notes

- Both setups use identical application code
- Configuration differences are minimal and necessary for version compatibility
- Bundle size measurements should be taken under identical conditions
- Consider testing on both development and production builds

**Goal**: Identify the root cause of the bundle size regression and find optimization strategies for Repack v5 + Rspack + MF2 setup.
