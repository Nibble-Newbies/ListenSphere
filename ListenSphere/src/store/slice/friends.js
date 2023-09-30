import { createSlice } from "@reduxjs/toolkit";
// create a slice to store data of user
const friendSlice = createSlice({
  name: "friends",
  initialState: {
    friends: null,
  },
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    updateFriends: (state, action) => {
      state.friends = action.payload;
    },
  },
});
export default friendSlice;
export const friendActions = friendSlice.actions;
