#!/bin/bash

# Verification script for Waveform Mapper Challenge package
# Run this before distributing to candidates to ensure everything is set up correctly

echo "🔍 Verifying Waveform Mapper Challenge Package..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
    else
        echo -e "${RED}✗${NC} Missing: $1"
        ((ERRORS++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Found directory: $1"
    else
        echo -e "${RED}✗${NC} Missing directory: $1"
        ((ERRORS++))
    fi
}

echo "📁 Checking file structure..."
echo ""

# Check core files
check_file "package.json"
check_file "tsconfig.json"
check_file "jest.config.js"
check_file ".gitignore"
check_file "README.md"
check_file "requirements.md"
check_file "QUICK_START.md"

echo ""
echo "📂 Checking directories..."
echo ""

check_dir "src"
check_dir "tests"
check_dir "fixtures"
check_dir "examples"

echo ""
echo "📝 Checking source files..."
echo ""

check_file "src/types.ts"
check_file "src/mapper.ts"
check_file "src/renderer.ts"
check_file "src/example.ts"
check_file "src/utils/validation.ts"

echo ""
echo "🧪 Checking test files..."
echo ""

check_file "tests/mapper.test.ts"

echo ""
echo "📊 Checking fixtures..."
echo ""

check_file "fixtures/basic.json"
check_file "fixtures/adjacent-speakers.json"
check_file "fixtures/overlapping.json"
check_file "fixtures/multiple-cuts.json"
check_file "fixtures/edge-cases.json"
check_file "fixtures/README.md"

echo ""
echo "📋 Checking examples..."
echo ""

check_file "examples/expected-output-basic.json"
check_file "examples/expected-output-complex.json"
check_file "examples/visual-timeline.md"

echo ""
echo "🔧 Verifying package.json structure..."
echo ""

if command -v node &> /dev/null; then
    # Check if package.json is valid JSON
    if node -e "require('./package.json')" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} package.json is valid JSON"
        
        # Check for required scripts
        if node -e "const pkg = require('./package.json'); if (!pkg.scripts.test) process.exit(1)" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} 'test' script defined"
        else
            echo -e "${RED}✗${NC} 'test' script missing"
            ((ERRORS++))
        fi
        
        if node -e "const pkg = require('./package.json'); if (!pkg.scripts.dev) process.exit(1)" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} 'dev' script defined"
        else
            echo -e "${RED}✗${NC} 'dev' script missing"
            ((ERRORS++))
        fi
        
    else
        echo -e "${RED}✗${NC} package.json is invalid JSON"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}⚠${NC} Node.js not found - skipping package.json validation"
    ((WARNINGS++))
fi

echo ""
echo "📦 Checking TypeScript configuration..."
echo ""

if [ -f "tsconfig.json" ]; then
    if command -v node &> /dev/null; then
        if node -e "require('./tsconfig.json')" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} tsconfig.json is valid JSON"
        else
            echo -e "${RED}✗${NC} tsconfig.json is invalid JSON"
            ((ERRORS++))
        fi
    fi
fi

echo ""
echo "🎯 Checking mapper.ts has TODO marker..."
echo ""

if grep -q "TODO: Implement" src/mapper.ts; then
    echo -e "${GREEN}✓${NC} mapper.ts contains TODO marker (not implemented)"
else
    echo -e "${YELLOW}⚠${NC} mapper.ts may already be implemented"
    ((WARNINGS++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ VERIFICATION PASSED!${NC}"
    echo ""
    echo "Package is ready for distribution."
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm install' to verify dependencies"
    echo "2. Run 'npm test' to ensure tests run (they should fail)"
    echo "3. Run 'npm run dev' to verify example script"
    echo "4. Distribute to candidate"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ VERIFICATION PASSED WITH WARNINGS${NC}"
    echo ""
    echo "Warnings: $WARNINGS"
    echo "Package should work but review warnings above."
    exit 0
else
    echo -e "${RED}❌ VERIFICATION FAILED!${NC}"
    echo ""
    echo "Errors: $ERRORS"
    echo "Warnings: $WARNINGS"
    echo ""
    echo "Please fix errors before distributing to candidates."
    exit 1
fi
