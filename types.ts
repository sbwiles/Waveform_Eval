/**
 * Core type definitions for the Waveform Segment Color Mapper
 */

/**
 * Represents a time segment on the timeline
 * All times are in milliseconds
 */
export interface TimeSegment {
  start: number;  // milliseconds
  end: number;    // milliseconds
}

/**
 * Input: A segment where a specific speaker is talking
 */
export interface SpeakerSegment extends TimeSegment {
  speakerId: string;  // e.g., "speaker_1", "host", "guest"
}

/**
 * Input: A segment that should be cut/removed from the timeline
 * These segments will appear as muted/greyed out in the waveform
 */
export interface CutSegment extends TimeSegment {
  // No additional properties - just marks time to cut
}

/**
 * Output: A renderable segment with color information
 * This is what gets passed to the waveform renderer
 */
export interface RenderableSegment extends TimeSegment {
  speakerId: string | 'CUT';  // 'CUT' for cut segments
  colorKey: string;            // Color identifier for rendering
}

/**
 * Configuration options for the mapper
 */
export interface MapperConfig {
  cutColorKey?: string;   // Color key for cut segments (default: 'muted')
  sortOutput?: boolean;   // Whether to sort output by start time (default: true)
}

/**
 * Main mapper function signature
 */
export type MapperFunction = (
  speakerSegments: SpeakerSegment[],
  cutSegments: CutSegment[],
  config?: MapperConfig
) => RenderableSegment[];

/**
 * Validation error for invalid segment data
 */
export class SegmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SegmentValidationError';
  }
}
