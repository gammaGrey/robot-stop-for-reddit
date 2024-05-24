import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./app/features/Post/PostSlice";
import commentsReducer from "./app/features/Comments/CommentsSlice";
import menuReducer from "./app/features/Menu/MenuSlice"
import userLoginReducer from "./app/features/UserLogin/UserLoginSlice";

const store = configureStore({
  reducer: {
    userLogin: userLoginReducer,
    menu: menuReducer,
    post: postReducer,
    comments: commentsReducer,
  },
});

export default store;