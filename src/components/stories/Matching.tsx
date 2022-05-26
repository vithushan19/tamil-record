import { useEffect, useState } from 'react';
import { Options } from 'react-lottie';
import { useDispatch } from 'react-redux';

import { enableContinue } from '@/features/stories/storySlice';

import MCOption, { OptionState } from './MCOption';

export interface Pair {
  text: string;
  translation: string;
}
interface MultipleChoiceProps {
  title: string;
  pairs: Pair[];
}
export default function Matching({ title, pairs }: MultipleChoiceProps) {
  const dispatch = useDispatch();

  const [selectedWord, setSelectedWord] = useState('');
  const [columnA, setColumnA] = useState<string[]>([]);
  const [columnB, setColumnB] = useState<string[]>([]);
  const [clearedWords, setClearedWords] = useState<string[]>([]);

  useEffect(() => {
    setColumnA(pairs.map((it) => it.text));
    setColumnB(
      pairs.map((it) => it.translation).sort((a, b) => Math.random() - 0.5)
    );
  }, []);
  const onColumnAClick = (columnAWord: string) => {
    if (columnB.includes(selectedWord)) {
      if (
        pairs.some((elem) => {
          return (
            JSON.stringify({ text: columnAWord, translation: selectedWord }) ===
            JSON.stringify(elem)
          );
        })
      ) {
        setClearedWords([...clearedWords, selectedWord, columnAWord]);
        setSelectedWord('');
      }
    } else {
      setSelectedWord(columnAWord);
    }
  };

  const onColumnBClick = (columnBWord: string) => {
    if (columnA.includes(selectedWord)) {
      if (pairs.includes({ text: selectedWord, translation: columnBWord })) {
        setClearedWords([...clearedWords, selectedWord, columnBWord]);
        setSelectedWord('');
      }
    } else {
      setSelectedWord(columnBWord);
    }
  };

  const getStateForWord = (text: string) => {
    if (text === selectedWord) {
      return WordState.SELECTED;
    } else if (clearedWords.includes(text)) {
      return WordState.CLEARED;
    }
    return WordState.DEFAULT;
  };

  return (
    <div className='flex items-center p-4 m-4 bg-gray-100 border-4 rounded-md border-rattata-500'>
      <div className='flex flex-col flex-1 ml-4'>
        <p className='mb-4 text-2xl'> {title}</p>
        <div className='grid grid-cols-2'>
          <div className='flex flex-col'>
            {columnA.map((it, index) => (
              <div key={index} onClick={(e) => onColumnAClick(it)}>
                <MatchingWord text={it} state={getStateForWord(it)} />
              </div>
            ))}
          </div>
          <div className='flex flex-col'>
            {columnB.map((it, index) => (
              <div key={index} onClick={(e) => onColumnBClick(it)}>
                <MatchingWord text={it} state={getStateForWord(it)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MatchingWordProps {
  text: string;
  state: WordState;
}
enum WordState {
  DEFAULT,
  SELECTED,
  CLEARED,
}
function MatchingWord({ text, state }: MatchingWordProps) {
  return (
    <p
      className={`p-4 m-2 text-center bg-white rounded-lg shadow-md cursor-pointer border-4 border-white ${
        state === WordState.SELECTED ? 'border-rattata-500  ' : ''
      }
      ${state === WordState.CLEARED ? 'border-bulbasaur-500  ' : ''}`}
    >
      {text}
    </p>
  );
}
