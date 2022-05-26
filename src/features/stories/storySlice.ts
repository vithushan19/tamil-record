import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { State } from '@/app/store';
import { StoryData } from '@/pages/story/[slug]';

export interface StoryState {
  currentStep: number;
  isContinueEnabled: boolean;
  isSessionEnd: boolean;
  storyData?: StoryData;
}
const initialState: StoryState = {
  currentStep: 1,
  isContinueEnabled: true,
  isSessionEnd: false,
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    loadStory: (state, action: PayloadAction<StoryData>) => {
      state.storyData = action.payload;
      state.currentStep = 20;
      state.isContinueEnabled = true;
      state.isSessionEnd = false;
    },
    disableContinue: (state) => {
      state.isContinueEnabled = false;
    },
    enableContinue: (state) => {
      state.isContinueEnabled = true;
    },
    handleContinue: (state) => {
      if (state?.storyData?.steps) {
        if (state.currentStep === state.storyData.steps.length) {
          state.isSessionEnd = true;
        } else if (
          state.storyData.steps[state.currentStep]._type === 'multipleChoice'
        ) {
          state.isContinueEnabled = false;
          state.currentStep += 1;
        } else {
          state.currentStep += 1;
        }
      }
    },
  },
});

export const { disableContinue, enableContinue, handleContinue, loadStory } =
  storySlice.actions;
export const selectStoryState = (state: State) => state.story;

export default storySlice.reducer;
