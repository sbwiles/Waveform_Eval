# Technical Requirements & Evaluation Guide

## Assessment Overview

**Duration:** 60 minutes  
**Type:** Algorithm + Interface Design  
**Language:** TypeScript  
**Focus:** Correctness, clarity, testing

---

## Core Requirements

### Functional Requirements

#### 1. Input Processing
- Accept array of `SpeakerSegment[]` with `{ start, end, speakerId }`
- Accept array of `CutSegment[]` with `{ start, end }`
- Handle empty arrays gracefully
- Validate input data

#### 2. Segment Splitting
- Split speaker segments where cut segments occur
- Create separate segments for before/during/after cuts
- Preserve speaker identity in non-cut portions

#### 3. Segment Merging
- Merge adjacent segments with identical `speakerId`
- Merge adjacent CUT segments
- Do NOT merge different speakers even if adjacent

#### 4. CUT Segment Marking
- All cut regions get `speakerId='CUT'`
- All cut regions get `colorKey='muted'` (or custom via config)
- CUT segments can stand alone (no speaker required)

#### 5. Output Formatting
- Return array of `RenderableSegment[]`
- Each segment has `{ start, end, speakerId, colorKey }`
- Segments sorted by `start` time
- No overlapping segments in output

---

## Non-Functional Requirements

### Code Quality

**Structure:**
- Functions should be < 20 lines where possible
- Single responsibility principle
- Clear separation of concerns

**Naming:**
- Descriptive variable/function names
- No abbreviations unless universally understood
- Consistent naming conventions

**Documentation:**
- JSDoc comments on public functions
- Inline comments for complex logic
- Invariants clearly stated

### Type Safety

- No use of `any` type
- All function signatures properly typed
- Use TypeScript's type inference
- Define custom types for clarity

### Testing

- Tests written for main functionality
- Tests for edge cases
- Tests for invariants
- Clear test descriptions

---

## Mandatory Invariants

Your implementation MUST guarantee:

### 1. No Overlaps
```typescript
// For any two consecutive segments:
output[i].end <= output[i+1].start
```

### 2. Chronological Order
```typescript
// Segments must be sorted:
output[i].start <= output[i+1].start
```

### 3. Valid Time Ranges
```typescript
// All segments must have:
segment.start >= 0
segment.end > segment.start
```

### 4. No Adjacent Duplicates
```typescript
// If segments are adjacent, they must differ:
if (output[i].end === output[i+1].start) {
  output[i].speakerId !== output[i+1].speakerId
}
```

### 5. CUT Segment Consistency
```typescript
// All CUT segments must have:
segment.speakerId === 'CUT'
segment.colorKey === 'muted' // or config.cutColorKey
```

---

## Edge Cases (Must Handle)

### Input Validation
- ✅ Negative start times → Throw `SegmentValidationError`
- ✅ End time <= start time → Throw `SegmentValidationError`
- ✅ NaN or Infinity values → Throw `SegmentValidationError`
- ✅ Empty arrays → Return empty array (no error)

### Overlapping Speakers
```typescript
speakers: [
  { start: 0, end: 5000, speakerId: 'A' },
  { start: 3000, end: 7000, speakerId: 'B' }
]
// Overlaps from 3000-5000ms
```

**Implementation-dependent behavior:**
- Option 1: Throw error (strictest)
- Option 2: First-speaker-wins
- Option 3: Last-speaker-wins

**Required:** Document your choice in code!

### Overlapping Cuts
```typescript
cuts: [
  { start: 2000, end: 5000 },
  { start: 4000, end: 7000 }
]
// Overlaps from 4000-5000ms
```

**Expected:** Merge into single cut `{ start: 2000, end: 7000 }`

### Adjacent Cuts
```typescript
cuts: [
  { start: 2000, end: 3000 },
  { start: 3000, end: 5000 }
]
// Adjacent at 3000ms
```

**Expected:** Merge into single cut `{ start: 2000, end: 5000 }`

### Boundary Cuts
```typescript
speakers: [{ start: 0, end: 5000, speakerId: 'A' }]
cuts: [{ start: 0, end: 5000 }]  // Exact match
```

**Expected:** Single CUT segment replacing speaker

### Cross-Boundary Cuts
```typescript
speakers: [
  { start: 0, end: 5000, speakerId: 'A' },
  { start: 5000, end: 10000, speakerId: 'B' }
]
cuts: [{ start: 4000, end: 6000 }]  // Crosses at 5000
```

**Expected:** Single CUT from 4000-6000, with speakers before/after

### Zero-Duration Segments
```typescript
segments: [{ start: 1000, end: 1000, speakerId: 'A' }]
```

**Implementation-dependent:**
- Option 1: Filter out (ignore)
- Option 2: Throw validation error

**Required:** Document your choice!

---

## Evaluation Rubric (100 points)

### Correctness (40 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| Basic case works | 10 | Simple splitting and merging |
| Multiple cuts work | 10 | Complex scenarios |
| Edge cases handled | 10 | Boundaries, overlaps, etc. |
| Invariants satisfied | 10 | No overlaps, sorted, etc. |

**Deductions:**
- Tests fail: -5 points per failing test
- Invariant violated: -10 points
- Doesn't run: -20 points

### Code Quality (25 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| Clear naming | 8 | Functions, variables clearly named |
| Small functions | 8 | <20 lines, focused responsibility |
| No duplication | 5 | DRY principle applied |
| Good organization | 4 | Logical file/function structure |

**Deductions:**
- Functions >30 lines: -2 points each
- Unclear names: -1 point each
- Code duplication: -3 points

### Testing (20 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| Main tests written | 10 | Core functionality tested |
| Edge case tests | 5 | Boundaries, invalid input |
| Test clarity | 5 | Clear descriptions, good coverage |

**Deductions:**
- No tests written: -15 points
- Tests don't run: -10 points

### Clarity (15 points)

| Criteria | Points | Description |
|----------|--------|-------------|
| Invariants documented | 5 | Clearly stated guarantees |
| Complex logic explained | 5 | Comments on tricky parts |
| Edge case decisions | 5 | Overlap handling, etc. explained |

**Deductions:**
- No documentation: -10 points
- Unclear edge case handling: -5 points

---

## Bonus Points (+10 maximum)

- **Excellent edge case handling** (+3): Handles all edge cases gracefully with clear error messages
- **Performance optimization** (+3): O(N log N) or better with explanation
- **Creative overlap solution** (+2): Novel approach to overlapping segments
- **Comprehensive types** (+2): Uses advanced TypeScript features effectively

---

## Minimum Passing Score

- **Pass:** 60/100
- **Good:** 75/100
- **Excellent:** 90/100

---

## Red Flags (Automatic Failure)

These indicate fundamental issues:

- ❌ Code doesn't compile
- ❌ Tests don't run
- ❌ Basic test case fails
- ❌ Output has overlapping segments
- ❌ Uses `any` type everywhere
- ❌ 100+ line monolithic function
- ❌ No attempt at testing

---

## What We're Really Looking For

### Technical Skills
- Algorithm design ability
- TypeScript proficiency
- Testing mindset
- Attention to detail

### Soft Skills
- Communication (through code/comments)
- Decision-making (edge cases)
- Pragmatism (simple > clever)
- Completeness (handles all cases)

### Red Flags
- Over-engineering (300 lines for simple task)
- Under-engineering (no validation, no tests)
- Lack of testing
- Poor naming

---

## Time Management Guidance

**Recommended breakdown:**

- **0-5 min:** Read requirements, understand problem
- **5-10 min:** Plan approach, sketch algorithm
- **10-40 min:** Implementation
- **40-50 min:** Testing and edge cases
- **50-60 min:** Documentation and cleanup

**Don't:**
- Spend 30 min planning
- Skip testing until the end
- Ignore edge cases
- Submit without testing

---

## Sample Solutions

### Minimum Acceptable
- Handles basic case
- Some edge cases fail
- Minimal testing
- Some documentation
- **Score: ~60-70**

### Good Solution
- All main tests pass
- Most edge cases handled
- Good test coverage
- Clear documentation
- **Score: ~75-85**

### Excellent Solution
- All tests pass including edge cases
- Clean, well-organized code
- Comprehensive tests
- Clear invariants and decisions documented
- **Score: ~90-100**

---

## Common Pitfalls

1. **Not handling overlaps** - Crashes or incorrect output
2. **Forgetting to merge** - Output has adjacent duplicates
3. **Not sorting output** - Segments in wrong order
4. **No validation** - Accepts invalid input silently
5. **Monolithic function** - One 200-line function
6. **No tests** - Can't verify correctness
7. **Using `any`** - Defeats TypeScript's purpose

---

## Success Indicators

**Good candidates will:**
- Ask clarifying questions about overlaps
- Write tests as they code
- Document decisions clearly
- Keep functions small and focused
- Handle edge cases thoughtfully

**Great candidates will:**
- Write all tests first (TDD)
- Create helper functions proactively
- Add meaningful error messages
- Consider performance implications
- Leave code in better state than found

---

## Post-Assessment Discussion

After submission, discuss:
1. How did you approach the problem?
2. What was most challenging?
3. How would you handle [specific edge case]?
4. What would you change with more time?
5. How would you optimize for production?

This reveals:
- Problem-solving process
- Communication skills
- Growth mindset
- Production thinking
