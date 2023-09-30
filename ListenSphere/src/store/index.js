import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/user'
import trackSlice from './slice/tracks'
import reviewSlice from './slice/review'
import friendSlice from './slice/friends'
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    track:trackSlice.reducer,
    review:reviewSlice.reducer,
    friend:friendSlice.reducer
  },
})

  