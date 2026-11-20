import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

export interface ArrangeProps {
  /** Tokens to arrange. Order in this array is the canonical order. */
  parts: string[];
  /** Full correct sentence. Falls back to `parts.join(' ')` if omitted. */
  answer?: string;
  /** English meaning shown as the prompt. */
  translation?: string | null;
  /** Optional short instruction ("Form the sentence"). */
  instruction?: string | null;
  /** Called once when the user arranges the tokens correctly. */
  onSolve?: () => void;
}

type Token = { id: string; text: string };

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeTokens(parts: string[]): Token[] {
  return parts.map((text, i) => ({ id: `t-${i}`, text }));
}

export default function Arrange({
  parts,
  answer,
  translation,
  instruction,
  onSolve,
}: ArrangeProps) {
  const targetAnswer = answer ?? parts.join(' ');

  const [available, setAvailable] = useState<Token[]>(() =>
    shuffle(makeTokens(parts)),
  );
  const [built, setBuilt] = useState<Token[]>([]);
  const [solved, setSolved] = useState(false);

  const isComplete = built.length === parts.length;
  const currentSentence = built.map((t) => t.text).join(' ');
  const isCorrect = isComplete && currentSentence === targetAnswer;

  // Fire onSolve exactly once
  useEffect(() => {
    if (isCorrect && !solved) {
      setSolved(true);
      onSolve?.();
    }
  }, [isCorrect, solved, onSolve]);

  const moveToBuilt = (token: Token) => {
    if (solved) return;
    setAvailable((a) => a.filter((t) => t.id !== token.id));
    setBuilt((b) => [...b, token]);
  };

  const moveToAvailable = (token: Token) => {
    if (solved) return;
    setBuilt((b) => b.filter((t) => t.id !== token.id));
    setAvailable((a) => [...a, token]);
  };

  const reset = () => {
    setAvailable(shuffle(makeTokens(parts)));
    setBuilt([]);
    setSolved(false);
  };

  const answerZoneClass = isCorrect
    ? 'border-green-500 bg-green-50'
    : isComplete
      ? 'border-red-400 bg-red-50'
      : 'border-gray-300 bg-gray-50';

  return (
    <div className='m-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      {instruction && (
        <p className='mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500'>
          {instruction}
        </p>
      )}
      {translation && (
        <p className='mb-4 text-base text-gray-700'>
          Build the sentence for:{' '}
          <span className='font-semibold text-gray-900'>{translation}</span>
        </p>
      )}

      {/* Answer zone */}
      <div
        className={`min-h-[3.5rem] rounded-md border-2 border-dashed p-2 transition-colors ${answerZoneClass}`}
      >
        {built.length === 0 ? (
          <span className='text-sm text-gray-400'>
            Tap the words below to build the sentence
          </span>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {built.map((token) => (
              <button
                key={token.id}
                type='button'
                onClick={() => moveToAvailable(token)}
                disabled={solved}
                className={`rounded-md px-3 py-1.5 text-base font-medium shadow-sm transition ${
                  isCorrect
                    ? 'bg-green-600 text-white'
                    : 'bg-charmander text-white hover:bg-yellow-700 disabled:opacity-80'
                }`}
              >
                {token.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Available tokens */}
      <div className='mt-3 flex flex-wrap gap-2'>
        {available.map((token) => (
          <button
            key={token.id}
            type='button'
            onClick={() => moveToBuilt(token)}
            className='rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 shadow-sm transition hover:bg-gray-100'
          >
            {token.text}
          </button>
        ))}
        {available.length === 0 && !isCorrect && (
          <span className='text-sm text-gray-400'>All words placed</span>
        )}
      </div>

      {/* Feedback */}
      <div className='mt-3 flex items-center justify-between'>
        {isCorrect ? (
          <p className='text-sm font-semibold text-green-700'>Correct! 🎉</p>
        ) : isComplete ? (
          <p className='text-sm text-red-600'>
            Not quite. Tap a word to move it back and try again.
          </p>
        ) : (
          <span />
        )}
        {(built.length > 0 || isComplete) && !isCorrect && (
          <button
            type='button'
            onClick={reset}
            className='text-sm text-gray-500 underline hover:text-gray-700'
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}