# Test Fixtures

This directory contains JSON test fixtures for the Waveform Segment Color Mapper assessment.

## Files

### `basic.json`
Simple test case with two speakers and one cut segment. Good starting point for implementation.

**Complexity:** ⭐ Easy  
**Tests:** Basic splitting of segments by cuts

### `adjacent-speakers.json`
Tests the merging functionality - adjacent segments with the same speaker should merge into one.

**Complexity:** ⭐⭐ Medium  
**Tests:** Adjacent segment merging

### `overlapping.json`
Edge case with overlapping speaker segments. Implementation-dependent - candidates decide how to handle.

**Complexity:** ⭐⭐⭐ Hard  
**Tests:** Overlap handling strategy, edge case reasoning

### `multiple-cuts.json`
Complex scenario with multiple cuts, including one that crosses a speaker boundary.

**Complexity:** ⭐⭐⭐ Hard  
**Tests:** Multiple segment splitting, boundary cases

### `edge-cases.json`
Collection of boundary conditions and edge cases including:
- Empty inputs
- Zero-duration segments
- Invalid time ranges
- Adjacent/overlapping cuts
- Cuts without speakers

**Complexity:** ⭐⭐⭐⭐ Very Hard  
**Tests:** Robustness, validation, comprehensive edge case handling

## Using Fixtures in Tests

```typescript
import basicFixture from '../fixtures/basic.json';
import { SpeakerSegment, CutSegment } from '../src/types';

const result = mapSegments(
  basicFixture.speakerSegments as SpeakerSegment[],
  basicFixture.cutSegments as CutSegment[]
);

expect(result).toEqual(basicFixture.expectedOutput);
```

## Expected Outputs

Most fixtures include an `expectedOutput` field showing the correct result. Some edge case fixtures are marked as `IMPLEMENTATION_DEPENDENT` - these test how candidates handle ambiguous situations and whether they document their decisions.

## Notes Field

Each fixture includes notes explaining:
- What the test case covers
- Why it's important
- Any special considerations
- For implementation-dependent cases: possible valid approaches
