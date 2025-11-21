#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function detectPackageManager() {
  if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) {
    return 'npm';
  }
  return 'npm'; // default
}

function checkIfShadcnInstalled() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Check for core shadcn/ui dependencies
    const requiredDeps = [
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react'
    ];

    const coreDepsInstalled = requiredDeps.filter(dep => deps[dep]);

    // Also check if essential shadcn/ui components are installed
    const componentsDir = path.join(process.cwd(), 'components', 'ui');
    const essentialComponents = ['button', 'card', 'input', 'label'];

    let componentsInstalled = 0;
    if (fs.existsSync(componentsDir)) {
      for (const component of essentialComponents) {
        if (fs.existsSync(path.join(componentsDir, `${component}.tsx`)) ||
            fs.existsSync(path.join(componentsDir, `${component}.ts`)) ||
            fs.existsSync(path.join(componentsDir, `${component}.jsx`)) ||
            fs.existsSync(path.join(componentsDir, `${component}.js`))) {
          componentsInstalled++;
        }
      }
    }

    // Require both core dependencies AND essential components
    return coreDepsInstalled.length >= requiredDeps.length && componentsInstalled >= essentialComponents.length;
  } catch (error) {
    return false;
  }
}

function installDependencies(packageManager, deps) {
  const installCmd = packageManager === 'yarn' ? 'add' : 'install';
  const cmd = `${packageManager} ${installCmd} ${deps.join(' ')}`;
  console.log(`Installing dependencies: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'init') {
    console.log('🚀 Initializing @bettercone/ui...\n');

    const packageManager = detectPackageManager();
    console.log(`📦 Detected package manager: ${packageManager}\n`);

    // Always install core dependencies
    const coreDeps = [
      '@bettercone/ui',
      'better-auth'
    ];

    console.log('📥 Installing core dependencies...');
    installDependencies(packageManager, coreDeps);

    // Check if shadcn/ui is already set up
    const hasShadcn = checkIfShadcnInstalled();

    if (hasShadcn) {
      console.log('✅ shadcn/ui fully detected (dependencies + components). You\'re all set!');
      console.log('\nshadcn/ui components will use your existing installation.');
    } else {
      console.log('\n📦 shadcn/ui dependencies not detected.');
      console.log('Setting up shadcn/ui...\n');

      // First initialize shadcn/ui
      console.log('Initializing shadcn/ui...');
      try {
        execSync('npx shadcn@latest init --yes', { stdio: 'inherit' });
      } catch (error) {
        console.log('⚠️  shadcn/ui init failed, it may already be initialized. Continuing...');
      }

      const shadcnDeps = [
        '@radix-ui/react-accordion',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-avatar',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-label',
        '@radix-ui/react-popover',
        '@radix-ui/react-progress',
        '@radix-ui/react-radio-group',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-select',
        '@radix-ui/react-separator',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        '@radix-ui/react-tabs',
        '@radix-ui/react-tooltip',
        'lucide-react',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'tailwindcss'
      ];

      console.log('Installing required shadcn/ui dependencies...\n');
      installDependencies(packageManager, shadcnDeps);

      // Now install the actual shadcn/ui components
      console.log('\n📦 Installing shadcn/ui components...\n');

      const shadcnComponents = [
        'button',
        'card',
        'input',
        'label',
        'skeleton',
        'alert',
        'avatar',
        'badge',
        'checkbox',
        'dialog',
        'dropdown-menu',
        'form',
        'progress',
        'radio-group',
        'select',
        'separator',
        'switch',
        'table',
        'tabs',
        'textarea',
        'alert-dialog',
        'drawer',
        'chart',
        'stepper',
        'input-otp'
      ];

      // Install components one by one to avoid conflicts
      for (const component of shadcnComponents) {
        try {
          console.log(`Installing ${component}...`);
          execSync(`npx shadcn@latest add ${component} --yes`, { stdio: 'inherit' });
        } catch (error) {
          console.log(`⚠️  Failed to install ${component}, skipping...`);
        }
      }
    }

    console.log('\n🎉 @bettercone/ui initialized successfully!');
    console.log('\nNext steps:');
    console.log('1. Import the CSS: @import "@bettercone/ui/css";');
    console.log('2. Set up Better Auth: https://better-auth.com');
    console.log('3. Start using components: https://docs.bettercone.com');

  } else {
    console.log('Usage: npx @bettercone/ui init');
    console.log('\nThis will install @bettercone/ui and all required dependencies.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}