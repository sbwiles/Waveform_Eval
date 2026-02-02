# Visual Timeline Examples

ASCII art representations of how the mapper should process segments.

## Example 1: Basic Cut

**Input:**
```
Speaker 1: [=====================================]  (0-5000ms)
Speaker 2:                                      [=====================================]  (5000-10000ms)
Cut:              [=======]                                                                (2000-3000ms)
```

**Output:**
```
Timeline: [█████░░█████]                    [█████████████████████████████████████]
          0    2  3    5                    10
          S1   CUT S1                       S2
```

**Segments:**
1. Speaker 1: 0-2000ms (before cut)
2. CUT: 2000-3000ms (the cut)
3. Speaker 1: 3000-5000ms (after cut, merged back to S1)
4. Speaker 2: 5000-10000ms (unchanged)

---

## Example 2: Adjacent Speakers (Should Merge)

**Input:**
```
Host:   [===================]  (0-2000ms)
Host:                       [===================]  (2000-4000ms)
Guest:                                          [===================]  (4000-6000ms)
```

**Output (After Merging):**
```
Timeline: [███████████████████████████████████][███████████████████]
          0                                   4                   6
          Host                                Guest
```

**Segments:**
1. Host: 0-4000ms (merged from two adjacent segments)
2. Guest: 4000-6000ms

---

## Example 3: Multiple Cuts

**Input:**
```
Speaker 1: [================================================================]  (0-10000ms)
Speaker 2:                                                                  [================================================================]  (10000-20000ms)
Cut A:           [====]                                                                                                                           (2000-3000ms)
Cut B:                         [====]                                                                                                            (5000-6000ms)
Cut C:                                                  [============]                                                                           (9000-11000ms)
```

**Output:**
```
Timeline: [████░░████░░███░░░░░░░]                                [█████████████████████████████████████]
          0    2  3  5  6  9     11                               20
          S1   C  S1 C  S1  CUT                                   S2
```

**Segments:**
1. Speaker 1: 0-2000ms
2. CUT: 2000-3000ms
3. Speaker 1: 3000-5000ms
4. CUT: 5000-6000ms
5. Speaker 1: 6000-9000ms
6. CUT: 9000-11000ms (crosses speaker boundary!)
7. Speaker 2: 11000-20000ms

---

## Example 4: Overlapping Speakers (Edge Case)

**Input:**
```
Speaker 1: [=============================]          (0-5000ms)
Speaker 2:               [=============================]  (3000-7000ms)
                         ^
                         Overlap: 3000-5000ms
```

**Possible Outputs (Implementation Dependent):**

### Option A: First-Speaker-Wins
```
Timeline: [█████████████████████████████]  [██████████]
          0                            5   7
          Speaker 1                       Speaker 2
```

### Option B: Last-Speaker-Wins
```
Timeline: [███████████]  [████████████████████████████]
          0           3  7
          Speaker 1      Speaker 2
```

### Option C: Throw Error
```
Error: SegmentValidationError: Overlapping speaker segments detected at 3000-5000ms
```

**Your implementation should choose ONE approach and document it!**

---

## Example 5: Adjacent Cuts (Should Merge)

**Input:**
```
Speaker 1: [================================================================]  (0-10000ms)
Cut A:           [========]                                                    (2000-3000ms)
Cut B:                    [========]                                           (3000-5000ms)
```

**Output (Cuts Merged):**
```
Timeline: [████░░░░░░░░░░░░███████████████████████████████]
          0    2          5                               10
          S1   CUT        S1
```

**Segments:**
1. Speaker 1: 0-2000ms
2. CUT: 2000-5000ms (merged from two adjacent cuts)
3. Speaker 1: 5000-10000ms

---

## Legend

```
█ = Active speaker segment
░ = Cut segment (muted/greyed out)
  = Gap (no segment)
```

---

## How to Validate Your Output

Your output should satisfy these visual properties:

1. **No gaps** between segments (unless there are truly no speakers in that range)
2. **No overlaps** - segments should be contiguous but not overlapping
3. **Merged adjacents** - consecutive segments with same speakerId should be merged
4. **Chronological** - left to right represents increasing time
5. **Clear cuts** - all cut regions should be marked with CUT/muted

---

## Testing Your Implementation

You can use the `renderTimeline()` function from `src/renderer.ts` to visualize your output:

```typescript
import { mapSegments } from './mapper';
import { renderTimeline } from './renderer';

const result = mapSegments(speakers, cuts);
console.log(renderTimeline(result));
```
