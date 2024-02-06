import { createSlice } from "@reduxjs/toolkit";

export const currentUser = createSlice({
  name: "currentUser",
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false,
    isAdmin: false,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    reset: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentUser, setToken, setIsLoggedIn, setIsAdmin, reset } =
  currentUser.actions;

export default currentUser.reducer;
