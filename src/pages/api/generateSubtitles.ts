import srtParser2 from 'srt-parser-2';

export const getSubtitles = () => {
  return fetch('/tamilCaptions/kanmoodiThirukkum.srt')
    .then((r) => r.text())
    .then((text) => {
      const parser = new srtParser2();
      const result = parser.fromSrt(text);
      return result;
    });
};
