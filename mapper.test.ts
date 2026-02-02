import { mapSegments } from '../src/mapper';
import { SpeakerSegment, CutSegment, RenderableSegment } from '../src/types';

// Load fixtures
import basicFixture from '../fixtures/basic.json';
import adjacentFixture from '../fixtures/adjacent-speakers.json';
import multipleCutsFixture from '../fixtures/multiple-cuts.json';
import edgeCasesFixture from '../fixtures/edge-cases.json';

describe('mapSegments', () => {
  
  describe('Basic functionality', () => {
    it('should handle simple speaker segments with one cut', () => {
      const result = mapSegments(
        basicFixture.speakerSegments as SpeakerSegment[],
        basicFixture.cutSegments as CutSegment[]
      );
      
      expect(result).toEqual(basicFixture.expectedOutput);
    });
    
    it('should return empty array for empty inputs', () => {
      const result = mapSegments([], []);
      expect(result).toEqual([]);
    });
    
    it('should handle speaker segments without any cuts', () => {
      const speakers: SpeakerSegment[] = [
        { start: 0, end: 5000, speakerId: 'speaker_1' }
      ];
      
      const result = mapSegments(speakers, []);
      
      expect(result).toEqual([
        { start: 0, end: 5000, speakerId: 'speaker_1', colorKey: 'speaker_1' }
      ]);
    });
  });
  
  describe('Merging adjacent segments', () => {
    it('should merge consecutive segments with same speakerId', () => {
      const result = mapSegments(
        adjacentFixture.speakerSegments as SpeakerSegment[],
        adjacentFixture.cutSegments as CutSegment[]
      );
      
      expect(result).toEqual(adjacentFixture.expectedOutput);
      expect(result.length).toBe(2); // Should merge into 2, not 3
    });
    
    it('should not merge segments with different speakerIds', () => {
      const speakers: SpeakerSegment[] = [
        { start: 0, end: 2000, speakerId: 'speaker_1' },
        { start: 2000, end: 4000, speakerId: 'speaker_2' }
      ];
      
      const result = mapSegments(speakers, []);
      
      expect(result.length).toBe(2);
      expect(result[0].speakerId).toBe('speaker_1');
      expect(result[1].speakerId).toBe('speaker_2');
    });
    
    // TODO: Add test for merging adjacent CUT segments
  });
  
  describe('Complex scenarios', () => {
    it('should handle multiple cuts across speakers', () => {
      const result = mapSegments(
        multipleCutsFixture.speakerSegments as SpeakerSegment[],
        multipleCutsFixture.cutSegments as CutSegment[]
      );
      
      expect(result).toEqual(multipleCutsFixture.expectedOutput);
    });
    
    it('should handle cut that crosses speaker boundary', () => {
      const speakers: SpeakerSegment[] = [
        { start: 0, end: 5000, speakerId: 'speaker_1' },
        { start: 5000, end: 10000, speakerId: 'speaker_2' }
      ];
      const cuts: CutSegment[] = [
        { start: 4000, end: 6000 }  // Crosses boundary at 5000
      ];
      
      const result = mapSegments(speakers, cuts);
      
      // Should split into segments around the cut
      const cutSegment = result.find(s => s.speakerId === 'CUT');
      expect(cutSegment).toBeDefined();
      expect(cutSegment?.start).toBe(4000);
      expect(cutSegment?.end).toBe(6000);
    });
    
    // TODO: Add test for multiple cuts, some overlapping
  });
  
  describe('Invariants', () => {
    it('should return segments in chronological order', () => {
      const result = mapSegments(
        basicFixture.speakerSegments as SpeakerSegment[],
        basicFixture.cutSegments as CutSegment[]
      );
      
      for (let i = 1; i < result.length; i++) {
        expect(result[i].start).toBeGreaterThanOrEqual(result[i - 1].end);
      }
    });
    
    it('should have no overlapping segments in output', () => {
      const result = mapSegments(
        multipleCutsFixture.speakerSegments as SpeakerSegment[],
        multipleCutsFixture.cutSegments as CutSegment[]
      );
      
      for (let i = 1; i < result.length; i++) {
        // Each segment should start at or after the previous segment ends
        expect(result[i].start).toBeGreaterThanOrEqual(result[i - 1].end);
      }
    });
    
    it('should mark all CUT segments with speakerId="CUT"', () => {
      const result = mapSegments(
        basicFixture.speakerSegments as SpeakerSegment[],
        basicFixture.cutSegments as CutSegment[]
      );
      
      const cutSegments = result.filter(s => s.colorKey === 'muted');
      cutSegments.forEach(seg => {
        expect(seg.speakerId).toBe('CUT');
      });
    });
    
    it('should mark all CUT segments with colorKey="muted"', () => {
      const result = mapSegments(
        multipleCutsFixture.speakerSegments as SpeakerSegment[],
        multipleCutsFixture.cutSegments as CutSegment[]
      );
      
      const cutSegments = result.filter(s => s.speakerId === 'CUT');
      cutSegments.forEach(seg => {
        expect(seg.colorKey).toBe('muted');
      });
    });
    
    it('should not have adjacent segments with same speakerId', () => {
      const result = mapSegments(
        adjacentFixture.speakerSegments as SpeakerSegment[],
        adjacentFixture.cutSegments as CutSegment[]
      );
      
      for (let i = 1; i < result.length; i++) {
        // Adjacent segments must have different speakerId
        expect(result[i].speakerId).not.toBe(result[i - 1].speakerId);
      }
    });
  });
  
  describe('Edge cases', () => {
    const emptyCase = edgeCasesFixture.testCases.find(tc => tc.name === 'Empty inputs');
    
    it('should handle empty speaker and cut arrays', () => {
      if (emptyCase) {
        const result = mapSegments(
          emptyCase.speakerSegments as SpeakerSegment[],
          emptyCase.cutSegments as CutSegment[]
        );
        expect(result).toEqual(emptyCase.expectedOutput);
      }
    });
    
    it('should handle cuts without speakers', () => {
      const cutsOnlyCase = edgeCasesFixture.testCases.find(tc => tc.name === 'Only cuts, no speakers');
      if (cutsOnlyCase) {
        const result = mapSegments(
          cutsOnlyCase.speakerSegments as SpeakerSegment[],
          cutsOnlyCase.cutSegments as CutSegment[]
        );
        expect(result).toEqual(cutsOnlyCase.expectedOutput);
      }
    });
    
    it('should validate segment times (end >= start)', () => {
      const invalidSegment: SpeakerSegment[] = [
        { start: 5000, end: 1000, speakerId: 'speaker_1' }
      ];
      
      expect(() => mapSegments(invalidSegment, [])).toThrow();
    });
    
    it('should handle cut that exactly matches speaker boundaries', () => {
      const exactMatchCase = edgeCasesFixture.testCases.find(
        tc => tc.name === 'Cut exactly matches speaker boundary'
      );
      if (exactMatchCase) {
        const result = mapSegments(
          exactMatchCase.speakerSegments as SpeakerSegment[],
          exactMatchCase.cutSegments as CutSegment[]
        );
        expect(result).toEqual(exactMatchCase.expectedOutput);
      }
    });
    
    // TODO: Add tests for:
    // - Zero-duration segments (document your handling approach)
    // - Negative times (should throw or clamp)
    // - Overlapping cuts (should merge)
    // - Adjacent cuts (should merge)
  });
  
  describe('Custom configuration', () => {
    it('should respect custom cutColorKey config', () => {
      const speakers: SpeakerSegment[] = [
        { start: 0, end: 5000, speakerId: 'speaker_1' }
      ];
      const cuts: CutSegment[] = [
        { start: 2000, end: 3000 }
      ];
      
      const result = mapSegments(speakers, cuts, { cutColorKey: 'custom-grey' });
      
      const cutSegment = result.find(s => s.speakerId === 'CUT');
      expect(cutSegment?.colorKey).toBe('custom-grey');
    });
    
    // TODO: Add test for sortOutput: false config option
  });
  
  describe('Performance', () => {
    it('should handle large number of segments efficiently', () => {
      // Generate 1000 speaker segments
      const speakers: SpeakerSegment[] = [];
      for (let i = 0; i < 1000; i++) {
        speakers.push({
          start: i * 1000,
          end: (i + 1) * 1000,
          speakerId: `speaker_${i % 10}`
        });
      }
      
      const cuts: CutSegment[] = [
        { start: 500, end: 1500 }
      ];
      
      const startTime = Date.now();
      const result = mapSegments(speakers, cuts);
      const endTime = Date.now();
      
      expect(result.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in < 1 second
    });
  });
});
