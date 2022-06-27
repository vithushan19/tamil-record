// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { TranslationServiceClient } from '@google-cloud/translate';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function hello(req: NextApiRequest, res: NextApiResponse) {
  const result = await quickStart();

  res.status(200).json({ result });
}

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = 'global';

// Instantiates a Google Translate client
const translationClient = new TranslationServiceClient({ projectId });

async function quickStart() {
  // The text to translate
  const text = 'Hello, world!';

  async function translateText() {
    // Construct request
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain', // mime types: text/plain, text/html
      sourceLanguageCode: 'en',
      targetLanguageCode: 'ta',
    };

    // Run request
    const [response] = await translationClient.translateText(request);

    const translations = [];

    if (response.translations) {
      for (const translation of response.translations) {
        console.log(`Translation: ${translation.translatedText}`);
        translations.push(translation.translatedText);
      }
    }
    return translations;
  }

  const translations = await translateText();
  console.log(`Text: ${text}`);

  return {
    tamizh: translations[0],
    english: text,
  };
}
