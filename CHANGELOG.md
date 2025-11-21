# Changelog

## [0.5.0] - 2025-11-21

### 🚀 Major Architectural Improvement: Clean Bundle Architecture

**Eliminated 712KB+ bundle bloat** by removing shadcn/ui component bundling:

- ✅ **shadcn/ui components no longer bundled** in `@bettercone/ui` package
- ✅ **Automatic CLI installation** - `npx @bettercone/ui init` installs everything needed
- ✅ **50%+ bundle size reduction** - From ~1.4MB to ~700KB
- ✅ **Clean separation** - Bettercone focuses on specialized auth components only

### 🛠️ Enhanced CLI Tool

**Smart one-command setup:**
```bash
npx @bettercone/ui init
```

- ✅ Detects existing shadcn/ui installations
- ✅ Installs missing dependencies automatically
- ✅ Installs essential shadcn/ui components
- ✅ Comprehensive component verification (dependencies + files)

### 📦 Bundle Size Optimization

- **Before**: ~1.4MB (including shadcn/ui components)
- **After**: ~700KB (auth components only)
- **Savings**: 50%+ bundle size reduction

### 🔄 Component Architecture Refinement

**Bettercone now focuses on specialized features:**
- 🔐 **Authentication & Security** - Core auth components
- 🏢 **Organization Management** - Team and org features
- 💳 **Billing & Subscriptions** - Payment integration
- 🔑 **API Key Management** - Developer tools

**shadcn/ui handles UI primitives:**
- 🎨 **UI Components** - Button, Card, Input, etc.
- 🎯 **Design System** - Consistent styling
- 🔧 **Customization** - Full control over components

### 💥 Breaking Changes

**Installation now requires CLI:**
```bash
# New way (recommended)
npx @bettercone/ui init

# Old way (still works but manual)
npm install @bettercone/ui better-auth
npx shadcn@latest init
npx shadcn@latest add button card input...
```

**shadcn/ui components no longer exported:**
```tsx
// ❌ No longer works
import { Button, Card } from '@bettercone/ui'

// ✅ Correct way
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuthView } from '@bettercone/ui'
```

## [1.0.0] - 2025-11-04

### UI Library Hub

Repository transformed into centralized hub for @bettercone/ui development.

- Component showcase at [bettercone.com](https://bettercone.com)
- Documentation at [docs.bettercone.com](https://docs.bettercone.com)  
- UI package source for [@bettercone/ui](https://www.npmjs.com/package/@bettercone/ui)
