import { configureStore } from '@reduxjs/toolkit';

import storyReducer, { StoryState } from '../features/stories/storySlice';

export interface State {
  story: StoryState;
}

export default configureStore({
  reducer: {
    story: storyReducer,
  },
});
