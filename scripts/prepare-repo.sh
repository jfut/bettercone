#!/bin/bash

# 🍦 BetterCone Repository Preparation Script
# Prepares BetterCone for publishing to a new GitHub repository
# This creates a fresh start, removing old git history

set -e  # Exit on error

echo "� BetterCone - Repository Preparation"
echo "=============================================="
echo ""
echo "This script will:"
echo "  1. Remove old git history (fresh start)"
echo "  2. Clean up temporary and build files"
echo "  3. Create initial commit"
echo "  4. Help you push to new GitHub repository"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "Please run this script from the root of the repository"
    exit 1
fi

echo "Step 1: Creating fresh git repository..."
echo "----------------------------------------"

print_warning "⚠️  This will REMOVE old git history and create a fresh start"
read -p "Continue? This cannot be undone! [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Removing old git history..."
    
    # Remove old git directory
    rm -rf .git
    
    # Initialize new git repository
    git init
    git branch -M main
    
    print_success "Fresh git repository initialized"
else
    print_error "Aborted by user"
    exit 1
fi

echo ""
echo "Step 2: Cleaning up unnecessary files..."
echo "----------------------------------------"

# Remove deprecated_docs folder (if exists)
if [ -d "deprecated_docs" ]; then
    rm -rf deprecated_docs
    print_success "Removed deprecated documentation"
fi

# Remove temporary/summary documentation files if they exist
if [ -f "DOCS_STRUCTURE.md" ]; then
    rm -f DOCS_STRUCTURE.md
    print_success "Removed temporary files"
fi

# Remove this script itself after execution
SCRIPT_TO_REMOVE="$0"

echo ""
echo "Step 3: Ensuring .gitignore is comprehensive..."
echo "----------------------------------------"

# Check if .gitignore exists and has essential entries
if [ -f ".gitignore" ]; then
    print_success ".gitignore found"
    
    # Add additional entries if not present
    grep -q "\.env\.local" .gitignore || echo ".env.local" >> .gitignore
    grep -q "\.env\$" .gitignore || echo ".env" >> .gitignore
    grep -q "\.DS_Store" .gitignore || echo ".DS_Store" >> .gitignore
    
    print_success "Essential .gitignore entries verified"
else
    print_error ".gitignore not found"
fi

echo ""
echo "Step 4: Removing sensitive data..."
echo "----------------------------------------"

# Remove any .env files
find . -name ".env.local" -type f -delete 2>/dev/null || true
find . -name ".env" -type f -delete 2>/dev/null || true
print_success "Environment files removed"

# Remove node_modules if present
if [ -d "node_modules" ]; then
    rm -rf node_modules
    print_success "Root node_modules removed"
fi

# Remove .next directories
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
print_success "Build artifacts removed"

# Remove .turbo cache
find . -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
print_success "Turbo cache removed"

# Remove .convex directories (will be regenerated)
find . -name ".convex" -type d -exec rm -rf {} + 2>/dev/null || true
print_success "Convex cache removed"

echo ""
echo "Step 5: Git configuration..."
echo "----------------------------------------"

# Stage all files
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    # Create initial commit
    git commit -m "� Initial commit: BetterCone v1.0.0

The AI-ready foundation for B2B SaaS

🎯 What's Included:
- ✅ Complete authentication (Better Auth - email/OAuth/2FA/passkeys)
- ✅ Stripe billing (subscriptions, webhooks, customer portal)
- ✅ Multi-tenant teams (organizations with RBAC)
- ✅ API infrastructure (keys, rate limiting, usage tracking)
- ✅ Email service (Resend + 5 React Email templates)
- ✅ 50+ shadcn/ui components (dark mode, responsive)

🤖 AI-Ready Features:
- ✅ llms.txt - AI discovers context instantly
- ✅ .cursorrules - Cursor AI automation
- ✅ 300+ prompts library
- ✅ Feature templates
- ✅ 2,900+ lines of AI docs

📊 Production Readiness: 98/100

🚀 Build features 5-10x faster with AI tools!

Tech Stack: Next.js 15, Convex, Better Auth, Stripe, TypeScript, Tailwind CSS, shadcn/ui
License: MIT"
    
    print_success "Initial commit created"
fi

echo ""
echo "Step 6: Next steps..."
echo "----------------------------------------"

print_info "Repository is ready for GitHub!"
echo ""
echo "📋 To publish BetterCone to GitHub:"
echo ""
echo "1️⃣  Create a new repository on GitHub"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: ${BLUE}bettercone${NC}"
echo "   - Description: 🍦 The AI-ready foundation for B2B SaaS"
echo "   - Make it ${GREEN}PUBLIC${NC} (recommended for community)"
echo "   - DON'T initialize with README, .gitignore, or license"
echo ""
echo "2️⃣  Push your code:"
echo "   ${BLUE}git remote add origin git@github.com:vncsleal/bettercone.git${NC}"
echo "   ${BLUE}git push -u origin main${NC}"
echo ""
echo "3️⃣  Configure GitHub repository:"
echo "   - Add topics: ${BLUE}b2b-saas, saas-starter, nextjs, convex, better-auth, stripe,"
echo "     ${BLUE}typescript, ai-ready, cursor, llms-txt, vibecoding${NC}"
echo "   - Add repository description: 🍦 The AI-ready foundation for B2B SaaS"
echo "   - Add website: https://github.com/vncsleal/bettercone"
echo "   - Enable Discussions for community questions"
echo "   - Add social preview image (1280x640px with logo)"
echo ""
echo "4️⃣  Create v1.0.0 release:"
echo "   ${BLUE}git tag -a v1.0.0 -m '🍦 BetterCone v1.0.0 - Initial Release'${NC}"
echo "   ${BLUE}git push origin v1.0.0${NC}"
echo "   - Go to GitHub → Releases → Draft a new release"
echo "   - Tag: v1.0.0"
echo "   - Title: 🍦 BetterCone v1.0.0 - The AI-Ready Foundation"
echo "   - Description: Use content from CHANGELOG.md"
echo ""
echo "5️⃣  Launch BetterCone (use .ai/VIBECODER_IMPLEMENTATION_COMPLETE.md for full plan):"
echo "   - Twitter/X thread (template in LAUNCH_MESSAGING.md)"
echo "   - Show HN post"
echo "   - Reddit: r/webdev, r/SaaS, r/cursor"
echo "   - Dev.to article"
echo "   - Indie Hackers"
echo ""

print_success "Preparation complete!"
echo ""
echo "🌟 ${YELLOW}Pro tip:${NC} Before launching, take screenshots of:"
echo "   📸 Dashboard with demo data"
echo "   📸 Billing/pricing page"
echo "   📸 Team management page"
echo "   📸 API keys page"
echo "   💬 Add them to README.md for better engagement!"
echo ""
echo "🤖 ${YELLOW}AI Features Highlight:${NC} Mention llms.txt and .cursorrules in your launch!"
echo ""

# Optional: Create a GitHub repository via CLI
read -p "Do you have GitHub CLI (gh) installed? Create repository now? [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Creating BetterCone repository on GitHub..."
    
    # Create public repository
    gh repo create bettercone \
        --public \
        --source=. \
        --remote=origin \
        --description="🍦 The AI-ready foundation for B2B SaaS - Built on Better Auth, Convex, Next.js & Stripe" \
        --push
    
    print_success "Repository created and pushed to GitHub!"
    
    # Add topics
    print_info "Adding repository topics..."
    gh repo edit vncsleal/bettercone \
        --add-topic b2b-saas \
        --add-topic saas-starter \
        --add-topic nextjs \
        --add-topic convex \
        --add-topic better-auth \
        --add-topic stripe \
        --add-topic typescript \
        --add-topic ai-ready \
        --add-topic cursor \
        --add-topic llms-txt \
        --add-topic vibecoding
    
    print_success "Topics added!"
    
    # Create release
    print_info "Creating v1.0.0 release..."
    git tag -a v1.0.0 -m "🍦 BetterCone v1.0.0 - Initial Release"
    git push origin v1.0.0
    
    print_success "Release tag pushed!"
    
    echo ""
    print_info "Opening repository in browser..."
    gh repo view --web
    
    echo ""
    print_success "🎉 BetterCone is live on GitHub!"
    echo ""
    echo "Next steps:"
    echo "  1. Add social preview image in Settings → Social preview"
    echo "  2. Enable Discussions in Settings → Features"
    echo "  3. Create release notes on GitHub (use CHANGELOG.md)"
    echo "  4. Start your launch campaign! 🚀"
else
    print_info "Manual setup selected. Follow the instructions above."
fi

echo ""
echo "🍦 ${GREEN}BetterCone is ready to help developers build SaaS 10x faster!${NC}"
echo ""
echo "✨ Good luck with your launch! ✨"
echo ""

# Remove this script after successful execution
if [ -f "$SCRIPT_TO_REMOVE" ]; then
    print_info "Cleaning up preparation script..."
    rm -f "$SCRIPT_TO_REMOVE"
    print_success "Script removed (one-time use)"
fi
