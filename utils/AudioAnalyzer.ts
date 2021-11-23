import { AudioAnalysisData } from "./spotifyApi";

export type AudioData = {
  pitch: number;
  timbre: number;
  volume: number;
};

export class AudioAnalyzer {
  public audioData: AudioAnalysisData;
  private segmentPosition: number = 0;
  public setAudioData = (data: AudioAnalysisData) => {
    this.audioData = data;
    this.getAudioDataAtTime = this._getAudioDataAtTime;
  };
  public currentAudioData: AudioData = { pitch: 0, volume: 0, timbre: 0 };

  public reset = () => {
    this.currentAudioData = { pitch: 0, volume: 0, timbre: 0 };
    this.setAudioData({ segments: [] });
    this.segmentPosition = 0;
    this.getAudioDataAtTime = this._getDummyAudioData;
  };

  public getAudioDataAtTime: (ms: number) => AudioData;

  private _getDummyAudioData = () => {
    return this.currentAudioData;
  };

  private _getAudioDataAtTime = (ms: number): AudioData => {
    const seconds = ms / 1000;
    let atSegment = false;
    while (!atSegment) {
      const segmentData = this.audioData.segments[this.segmentPosition];
      if (
        segmentData.start < seconds &&
        segmentData.start + segmentData.duration > seconds
      ) {
        atSegment = true;
      } else if (segmentData.start > seconds) {
        this.segmentPosition -= 1;
      } else {
        this.segmentPosition += 1;
      }
    }
    const segment = this.audioData.segments[this.segmentPosition];
    const dataLength = segment.pitches.length;
    const currentDataIndex = Math.floor(
      ((seconds - segment.start) * dataLength) / segment.duration
    );
    const ratio = currentDataIndex / segment.pitches.length;
    const volumeDiff = segment.loudness_start - segment.loudness_max;
    const volumeDiffRatio = ratio * volumeDiff;
    const volume = segment.loudness_max - (volumeDiff - volumeDiffRatio);
    this.currentAudioData = {
      pitch: segment.pitches[currentDataIndex],
      timbre: segment.timbre[currentDataIndex],
      volume,
    };
    return this.currentAudioData;
  };
}
