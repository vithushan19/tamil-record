import srtParser2 from 'srt-parser-2';

export const getSubtitlesTamil = () => {
  return fetch('/tamilCaptions/kanmoodiThirukkum.srt')
    .then((r) => r.text())
    .then((text) => {
      const parser = new srtParser2();
      const result = parser.fromSrt(text);
      return result;
    });
};
export const getSubtitlesTransliteration = () => {
  return fetch('/tamilCaptions/kanmoodiThirukkumTransliteration.srt')
    .then((r) => r.text())
    .then((text) => {
      const parser = new srtParser2();
      const result = parser.fromSrt(text);
      return result;
    });
};
export const getSubtitlesEnglish = () => {
  return fetch('/tamilCaptions/kanmoodiThirukkumEnglish.srt')
    .then((r) => r.text())
    .then((text) => {
      const parser = new srtParser2();
      const result = parser.fromSrt(text);
      return result;
    });
};
