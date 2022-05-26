import { useEffect, useState } from 'react';
import { Options } from 'react-lottie';
import { useDispatch } from 'react-redux';

import { enableContinue } from '@/features/stories/storySlice';

import MCOption, { OptionState } from './MCOption';

interface Choice {
  title: string;
  isCorrect: boolean;
}
interface MultipleChoiceProps {
  question: string;
  choices: Choice[];
}
export default function MultipleChoice({
  question,
  choices,
}: MultipleChoiceProps) {
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const selectOptionRequested = (index: number) => {
    setSelectedOption(index);
    dispatch(enableContinue());
  };

  const getOptionState = (index: number) => {
    if (index === selectedOption) {
      if (choices[index].isCorrect) {
        return OptionState.CORRECT;
      } else {
        return OptionState.INCORRECT;
      }
    } else {
      return OptionState.DEFAULT;
    }
  };

  return (
    <div className='flex items-center p-4 m-4 bg-gray-100 border-4 rounded-md border-rattata-500'>
      <div className='flex flex-col flex-1 ml-4'>
        <p className='mb-4 text-2xl'> {question}</p>
        {choices.map((it, index) => (
          <div
            key={index}
            onClick={(e) => selectOptionRequested(index)}
            className='mb-4 cursor-pointer'
          >
            <MCOption text={it.title} state={getOptionState(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}
