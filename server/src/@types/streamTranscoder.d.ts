import { Readable } from 'stream'

declare module 'stream-transcoder' {
  class StreamTranscoder {
    constructor(videoStream: Readable)
    maxSize(width: number, height: number): StreamTranscoder
    videoCodec(codec: 'h264'): StreamTranscoder
    videoBitrate(bitRate: number): StreamTranscoder
    fps(amount: number): StreamTranscoder
    audioCodec(codec: 'libfaac'): StreamTranscoder
    sampleRate(rate: number): StreamTranscoder
    channels(amount: number): StreamTranscoder
    audioBitrate(bitRate: number): StreamTranscoder
    format(format: 'mp4'): StreamTranscoder
    stream(): Readable
  }

  // eslint-disable-next-line import/no-default-export
  export default StreamTranscoder
}
