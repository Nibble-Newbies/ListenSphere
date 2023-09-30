import { createSlice } from "@reduxjs/toolkit";
// create a slice to store data of user
const reviewSlice = createSlice({
  name: "review",
  initialState: {
    review: null,
  },
  reducers: {
    setReview: (state, action) => {
      state.review = action.payload;
    },
    updateReview: (state, action) => {
      state.review = action.payload;
    },
  },
});
export default reviewSlice;
export const reviewActions = reviewSlice.actions;
