import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import currentUserReducer from "../pages/Login/currentUserSlice";
import uploadReducer from "../components/Upload/uploadSlice";
import { jwtDecode } from "jwt-decode";

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  upload: uploadReducer,
});

const currentUserLocalStorage = JSON.parse(localStorage.getItem("currentUser"));
const currentToken = JSON.parse(localStorage.getItem("token"));
const isAdmin = currentToken ? jwtDecode(currentToken).isAdmin : false;
const isLoggedInLocalStorage = currentUserLocalStorage ? true : false;

const initialState = {
  user: currentUserLocalStorage,
  token: currentToken,
  isLoggedIn: isLoggedInLocalStorage,
  isAdmin: isAdmin,
} || {
  user: null,
  token: null,
  isLoggedIn: false,
  isAdmin: false,
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    currentUser: initialState,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
