import { RenderableSegment } from './types';

/**
 * Renders segments to console for visualization
 * This is a stub - in production this would render actual waveforms with colors
 */
export function renderSegments(segments: RenderableSegment[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('WAVEFORM TIMELINE VISUALIZATION');
  console.log('='.repeat(80) + '\n');
  
  if (segments.length === 0) {
    console.log('  (no segments to render)\n');
    return;
  }
  
  segments.forEach((seg, idx) => {
    const duration = seg.end - seg.start;
    const bar = generateBar(duration, seg.colorKey);
    const isCut = seg.speakerId === 'CUT';
    const marker = isCut ? '✂️ ' : '🎙️ ';
    
    console.log(
      `${marker}[${idx.toString().padStart(2)}] ` +
      `${seg.start.toString().padStart(6)}ms - ${seg.end.toString().padStart(6)}ms | ` +
      `${seg.speakerId.padEnd(12)} | ${seg.colorKey.padEnd(10)} | ${bar}`
    );
  });
  
  console.log('\n' + '='.repeat(80) + '\n');
}

/**
 * Generate a visual bar for the segment duration
 */
function generateBar(duration: number, colorKey: string): string {
  const maxWidth = 40;
  const scale = 50; // milliseconds per character
  const width = Math.min(Math.max(1, Math.floor(duration / scale)), maxWidth);
  
  // Different characters for different types
  const char = colorKey === 'muted' ? '░' : '█';
  
  return char.repeat(width);
}

/**
 * Create ASCII timeline visualization showing the entire timeline
 */
export function renderTimeline(
  segments: RenderableSegment[], 
  totalDuration?: number
): string {
  if (segments.length === 0) {
    return '(empty timeline)';
  }
  
  const maxTime = totalDuration ?? Math.max(...segments.map(s => s.end));
  const width = 80;
  const scale = maxTime / width;
  
  let timeline = '';
  let timeLabels = '\n';
  
  // Create timeline visualization
  for (let i = 0; i < width; i++) {
    const time = i * scale;
    const segment = segments.find(s => time >= s.start && time < s.end);
    
    if (segment) {
      timeline += segment.colorKey === 'muted' ? '░' : '█';
    } else {
      timeline += ' ';
    }
    
    // Add time markers every 10 characters
    if (i % 10 === 0) {
      const timeMs = Math.round(time);
      const label = `${timeMs}`.padStart(5);
      timeLabels += label + '     ';
    }
  }
  
  return timeline + timeLabels;
}

/**
 * Print a summary of the segments
 */
export function printSummary(segments: RenderableSegment[]): void {
  const totalDuration = segments.length > 0 
    ? Math.max(...segments.map(s => s.end)) 
    : 0;
  
  const cutSegments = segments.filter(s => s.speakerId === 'CUT');
  const speakerSegments = segments.filter(s => s.speakerId !== 'CUT');
  
  const totalCutTime = cutSegments.reduce((sum, s) => sum + (s.end - s.start), 0);
  const totalSpeakerTime = speakerSegments.reduce((sum, s) => sum + (s.end - s.start), 0);
  
  const speakers = new Set(speakerSegments.map(s => s.speakerId));
  
  console.log('SUMMARY');
  console.log('-'.repeat(40));
  console.log(`Total segments:     ${segments.length}`);
  console.log(`Speaker segments:   ${speakerSegments.length}`);
  console.log(`Cut segments:       ${cutSegments.length}`);
  console.log(`Unique speakers:    ${speakers.size}`);
  console.log(`Total duration:     ${totalDuration}ms`);
  console.log(`Speaker time:       ${totalSpeakerTime}ms`);
  console.log(`Cut time:           ${totalCutTime}ms`);
  console.log('-'.repeat(40) + '\n');
}
