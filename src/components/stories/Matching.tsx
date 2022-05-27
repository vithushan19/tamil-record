import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { enableContinue } from '@/features/stories/storySlice';

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
  const [isComplete, setComplete] = useState(false);

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
        const nextClearedWords = [...clearedWords, selectedWord, columnAWord];
        setClearedWords(nextClearedWords);
        setSelectedWord('');
        if (nextClearedWords.length >= columnA.length * 2) {
          setComplete(true);
          dispatch(enableContinue());
        }
      }
    } else if (!clearedWords.includes(columnAWord)) {
      setSelectedWord(columnAWord);
    }
  };

  const onColumnBClick = (columnBWord: string) => {
    if (columnA.includes(selectedWord)) {
      if (
        pairs.some((elem) => {
          return (
            JSON.stringify({ text: selectedWord, translation: columnBWord }) ===
            JSON.stringify(elem)
          );
        })
      ) {
        const nextClearedWords = [...clearedWords, selectedWord, columnBWord];
        setClearedWords(nextClearedWords);
        setSelectedWord('');
        if (nextClearedWords.length >= columnB.length * 2) {
          setComplete(true);
          dispatch(enableContinue());
        }
      }
    } else if (!clearedWords.includes(columnBWord)) {
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
    <div className='flex items-center p-4 m-4 bg-gray-100 border-4 rounded-md border-rattata-500 h-128'>
      <div className='flex flex-col flex-1 ml-4'>
        <p className='mb-4 text-2xl text-center'> {title}</p>
        {isComplete ? (
          <div className='flex flex-col items-center'>
            <h2 className='mb-4'>Complete</h2>
            <Image
              height={164}
              width={164}
              alt={'complete'}
              className='object-cover transition-all duration-500 ease-in-out transform hover:scale-105'
              src={'/images/stories/checkmark.svg'}
            ></Image>
          </div>
        ) : (
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
        )}
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
