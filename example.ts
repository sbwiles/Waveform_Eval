import { mapSegments } from './mapper';
import { renderSegments, renderTimeline, printSummary } from './renderer';
import { SpeakerSegment, CutSegment } from './types';

/**
 * Example usage of the mapper function
 * Run with: npm run dev
 */

function runExample() {
  console.log('\n🎙️  WAVEFORM SEGMENT COLOR MAPPER - EXAMPLE\n');
  
  // Example 1: Basic case
  console.log('📝 Example 1: Basic speaker segments with one cut\n');
  
  const speakers1: SpeakerSegment[] = [
    { start: 0, end: 5000, speakerId: 'host' },
    { start: 5000, end: 10000, speakerId: 'guest' }
  ];
  
  const cuts1: CutSegment[] = [
    { start: 2000, end: 3000 }
  ];
  
  try {
    const result1 = mapSegments(speakers1, cuts1);
    renderSegments(result1);
    console.log('Timeline:', renderTimeline(result1, 10000));
    printSummary(result1);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
  
  // Example 2: Adjacent speakers (should merge)
  console.log('\n📝 Example 2: Adjacent segments with same speaker (should merge)\n');
  
  const speakers2: SpeakerSegment[] = [
    { start: 0, end: 2000, speakerId: 'host' },
    { start: 2000, end: 4000, speakerId: 'host' },  // Same speaker, should merge
    { start: 4000, end: 6000, speakerId: 'guest' }
  ];
  
  const cuts2: CutSegment[] = [];
  
  try {
    const result2 = mapSegments(speakers2, cuts2);
    renderSegments(result2);
    console.log('Timeline:', renderTimeline(result2, 6000));
    printSummary(result2);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
  
  // Example 3: Multiple cuts
  console.log('\n📝 Example 3: Multiple cuts across speakers\n');
  
  const speakers3: SpeakerSegment[] = [
    { start: 0, end: 10000, speakerId: 'speaker_1' },
    { start: 10000, end: 20000, speakerId: 'speaker_2' }
  ];
  
  const cuts3: CutSegment[] = [
    { start: 2000, end: 3000 },
    { start: 5000, end: 6000 },
    { start: 9000, end: 11000 }  // Crosses speaker boundary
  ];
  
  try {
    const result3 = mapSegments(speakers3, cuts3);
    renderSegments(result3);
    console.log('Timeline:', renderTimeline(result3, 20000));
    printSummary(result3);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
  
  console.log('✅ Examples completed!\n');
}

// Run the examples
runExample();
