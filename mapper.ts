import { 
  SpeakerSegment, 
  CutSegment, 
  RenderableSegment, 
  MapperConfig,
  SegmentValidationError 
} from './types';

/**
 * Maps speaker and cut segments into a timeline suitable for waveform rendering
 * 
 * REQUIREMENTS:
 * 1. Split speaker segments where cuts occur
 * 2. Merge adjacent segments with the same speakerId
 * 3. Mark CUT segments with speakerId='CUT' and colorKey='muted' (or config.cutColorKey)
 * 4. Return segments in chronological order (sorted by start time)
 * 5. Handle edge cases gracefully (overlaps, invalid data, etc.)
 * 
 * INVARIANTS (your implementation must guarantee these):
 * - Output segments never overlap
 * - Output segments are sorted by start time
 * - Adjacent output segments have different speakerId or colorKey
 * - All CUT segments have speakerId='CUT'
 * - All segments have valid times (0 <= start < end)
 * 
 * @param speakerSegments - Array of speaker time segments
 * @param cutSegments - Array of segments to mark as cuts
 * @param config - Optional configuration
 * @returns Array of renderable segments suitable for waveform display
 * 
 * @throws {SegmentValidationError} If input segments are invalid
 * 
 * @example
 * ```typescript
 * const result = mapSegments(
 *   [{ start: 0, end: 5000, speakerId: 'host' }],
 *   [{ start: 2000, end: 3000 }]
 * );
 * // Result: [
 * //   { start: 0, end: 2000, speakerId: 'host', colorKey: 'host' },
 * //   { start: 2000, end: 3000, speakerId: 'CUT', colorKey: 'muted' },
 * //   { start: 3000, end: 5000, speakerId: 'host', colorKey: 'host' }
 * // ]
 * ```
 */
export function mapSegments(
  speakerSegments: SpeakerSegment[],
  cutSegments: CutSegment[],
  config: MapperConfig = {}
): RenderableSegment[] {
  
  // TODO: Implement your solution here
  
  // Suggested approach (feel free to use a different strategy):
  // 
  // 1. Validate all input segments
  // 2. Create a list of all "events" (segment starts and ends)
  // 3. Sort events chronologically
  // 4. Process events to build output segments
  // 5. Merge adjacent segments with same speakerId
  // 6. Return sorted result
  //
  // Alternative approaches:
  // - Interval tree/sweep line algorithm
  // - Recursive splitting
  // - Build timeline array and compress
  
  throw new Error('Not implemented - this is your task!');
}

// ============================================================================
// Helper Functions (optional - create your own as needed)
// ============================================================================

/**
 * Validates a single segment
 * @throws {SegmentValidationError} if segment is invalid
 */
function validateSegment(segment: TimeSegment, label: string): void {
  // TODO: Implement validation
  // Check: start >= 0, end > start, no NaN/Infinity, etc.
}

/**
 * Merges adjacent segments that have the same speakerId and colorKey
 * 
 * Example:
 * Input:  [{ start: 0, end: 2, speakerId: 'A', colorKey: 'A' },
 *          { start: 2, end: 5, speakerId: 'A', colorKey: 'A' }]
 * Output: [{ start: 0, end: 5, speakerId: 'A', colorKey: 'A' }]
 */
function mergeAdjacentSegments(
  segments: RenderableSegment[]
): RenderableSegment[] {
  // TODO: Implement merging logic
  // Remember: only merge if segments are truly adjacent (end of one === start of next)
  // and have the same speakerId AND colorKey
  return segments;
}

/**
 * Sorts segments by start time
 */
function sortSegments(segments: RenderableSegment[]): RenderableSegment[] {
  // TODO: Implement sorting
  return segments;
}
