# Quick Start Guide

## For Administrators

### Setting Up the Assessment

1. **Extract the package:**
   ```bash
   tar -xzf waveform-mapper-challenge.tar.gz
   cd waveform-mapper-challenge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify setup:**
   ```bash
   npm run check   # TypeScript should compile
   npm test        # Tests should fail (not implemented)
   npm run dev     # Should show "Not implemented" error
   ```

4. **Distribute to candidate:**
   - Share the entire directory or zip file
   - Ensure candidate has Node.js 18+ installed
   - Provide 60-minute time limit
   - Share README.md link first

### Pre-Assessment Checklist

- [ ] Node.js and npm are installed
- [ ] Package installs successfully
- [ ] TypeScript compiles without errors
- [ ] Jest runs (even if tests fail)
- [ ] Candidate has access to TypeScript docs if needed

---

## For Candidates

### Step 1: Setup (5 minutes)

```bash
# Install dependencies
npm install

# Verify everything works
npm run check
npm test
npm run dev
```

**Expected output:**
- `npm install` → Installs ~300 packages
- `npm run check` → No TypeScript errors
- `npm test` → Tests run but fail (expected!)
- `npm run dev` → "Not implemented" error (expected!)

### Step 2: Understand the Problem (5 minutes)

1. **Read the README:**
   ```bash
   # Open README.md in your editor
   ```

2. **Look at examples:**
   - Check `fixtures/basic.json` for a simple test case
   - Look at `examples/visual-timeline.md` for visual examples

3. **Understand the types:**
   ```typescript
   // Input
   SpeakerSegment: { start: number, end: number, speakerId: string }
   CutSegment: { start: number, end: number }
   
   // Output
   RenderableSegment: { start: number, end: number, speakerId: string | 'CUT', colorKey: string }
   ```

### Step 3: Plan Your Approach (5 minutes)

Before coding, think about:
- How will you split segments where cuts occur?
- How will you merge adjacent segments?
- How will you handle overlapping segments?
- What order will you implement features?

### Step 4: Implement (40 minutes)

**File to edit:** `src/mapper.ts`

#### Recommended Order:

1. **Start simple** (10 min):
   ```typescript
   // Make basic.json test pass
   - Handle one speaker, one cut
   - Don't worry about merging yet
   ```

2. **Add merging** (10 min):
   ```typescript
   // Make adjacent-speakers.json test pass
   - Merge adjacent segments with same speakerId
   ```

3. **Handle complexity** (10 min):
   ```typescript
   // Make multiple-cuts.json test pass
   - Multiple cuts
   - Cuts crossing boundaries
   ```

4. **Edge cases** (10 min):
   ```typescript
   // Make edge-cases.json tests pass
   - Empty inputs
   - Invalid inputs
   - Overlapping segments
   ```

#### Development Workflow:

```bash
# Terminal 1: Run tests in watch mode
npm run test:watch

# Terminal 2: Run example to see output
npm run dev

# Or: Run specific test file
npm test -- tests/mapper.test.ts
```

### Step 5: Test & Refine (10 minutes)

```bash
# Run all tests
npm test

# Check coverage
npm run test:coverage

# Verify TypeScript
npm run check

# Test with examples
npm run dev
```

**Before submitting, ensure:**
- [ ] `npm test` passes
- [ ] `npm run check` has no errors
- [ ] Code has comments explaining complex logic
- [ ] Edge case decisions are documented
- [ ] README updated with your approach

---

## Time Management Tips

### If You're Ahead of Schedule:
- Add more edge case tests
- Optimize your algorithm
- Add better error messages
- Write comprehensive JSDoc comments

### If You're Running Behind:
- Focus on getting basic tests to pass first
- Skip optimization for now
- Use TODO comments for edge cases
- Document what you would do with more time

### 15 Minutes Left:
- Stop adding features
- Focus on making existing tests pass
- Add minimal documentation
- Clean up obvious issues

### 5 Minutes Left:
- Run final `npm test`
- Quick README update
- Don't start anything new!

---

## Common Setup Issues

### Issue: `npm install` fails

**Solution:**
```bash
# Try clearing cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors on valid code

**Solution:**
```bash
# Ensure you're using TypeScript 5.x
npm list typescript

# Reinstall if needed
npm install -D typescript@^5.0.0
```

### Issue: Tests won't run

**Solution:**
```bash
# Check Jest is installed
npm list jest

# Try running directly
npx jest

# Check jest.config.js exists
ls -la jest.config.js
```

### Issue: `ts-node` command not found

**Solution:**
```bash
# Install as dev dependency
npm install -D ts-node

# Or run via npx
npx ts-node src/example.ts
```

---

## File Quick Reference

| File | Purpose | Status |
|------|---------|--------|
| `src/mapper.ts` | **YOUR CODE HERE** | TODO |
| `src/types.ts` | Type definitions | Provided |
| `src/renderer.ts` | Visualization | Provided |
| `src/example.ts` | Usage examples | Provided |
| `tests/mapper.test.ts` | Test suite | Starter |
| `fixtures/*.json` | Test data | Provided |

---

## Testing Strategy

### 1. Test-First Approach (Recommended)

```typescript
// 1. Write a test
it('should split segment by cut', () => {
  const result = mapSegments([...], [...]);
  expect(result.length).toBe(3);
});

// 2. Run test (it fails)
npm test

// 3. Implement feature
// ... code ...

// 4. Run test (it passes)
npm test
```

### 2. Example-Driven Approach

```typescript
// 1. Look at fixture
// fixtures/basic.json

// 2. Run dev to see what happens
npm run dev

// 3. Implement to match expected output
// ... code ...

// 4. Verify with dev again
npm run dev
```

### 3. Incremental Approach

```typescript
// Start with simplest case
if (cutSegments.length === 0) {
  return speakerSegments.map(s => ({
    ...s,
    colorKey: s.speakerId
  }));
}

// Add complexity gradually
// ... handle one cut ...
// ... handle multiple cuts ...
// ... handle overlaps ...
```

---

## Keyboard Shortcuts

If using VS Code:

- **Run TypeScript check**: `Cmd/Ctrl + Shift + B`
- **Go to definition**: `F12`
- **Show all references**: `Shift + F12`
- **Rename symbol**: `F2`
- **Format document**: `Shift + Alt + F`

---

## Debugging Tips

### Console Logging

```typescript
// Log segments for debugging
console.log('Input speakers:', speakerSegments);
console.log('Input cuts:', cutSegments);
console.log('Output:', result);

// Use renderer for visual output
import { renderSegments } from './renderer';
renderSegments(result);
```

### Test Debugging

```typescript
// Run single test
npm test -- -t "should split segment by cut"

// Add .only to focus on one test
it.only('should split segment by cut', () => {
  // ...
});

// Skip tests
it.skip('complex test I will finish later', () => {
  // ...
});
```

### TypeScript Errors

```typescript
// Check what type TS inferred
const result: unknown = mapSegments(...);
console.log(result);

// Hover over variables in VS Code to see types
```

---

## Submission Checklist

Before you submit:

- [ ] `npm test` - All tests pass
- [ ] `npm run check` - No TypeScript errors
- [ ] `npm run dev` - Example runs without crashes
- [ ] Code has clear function/variable names
- [ ] Complex logic has explanatory comments
- [ ] Invariants are documented
- [ ] Edge case handling is explained
- [ ] README section "Your Implementation" is filled out

---

## Good Luck! 🚀

Remember:
- **Correct** > Clever
- **Simple** > Complex
- **Tested** > Untested
- **Documented** > Mysterious

You've got this! 💪
