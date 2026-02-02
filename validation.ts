import { TimeSegment, SegmentValidationError } from './types';

/**
 * Utility functions for validating segments
 * Feel free to use, modify, or ignore these helpers
 */

/**
 * Check if a segment has valid time values
 */
export function isValidSegment(segment: TimeSegment): boolean {
  // TODO: Implement validation logic
  // Consider: start >= 0, end > start, no NaN, no Infinity, etc.
  return true;
}

/**
 * Check if two segments overlap
 */
export function doSegmentsOverlap(a: TimeSegment, b: TimeSegment): boolean {
  // TODO: Implement overlap detection
  // Segments overlap if they share any time range
  return false;
}

/**
 * Check if two segments are adjacent (touching but not overlapping)
 */
export function areSegmentsAdjacent(a: TimeSegment, b: TimeSegment): boolean {
  // TODO: Implement adjacency check
  // Adjacent means end of one === start of other
  return false;
}

/**
 * Get the overlapping portion of two segments, if any
 */
export function getOverlap(a: TimeSegment, b: TimeSegment): TimeSegment | null {
  // TODO: Implement overlap calculation
  // Return null if no overlap
  return null;
}
