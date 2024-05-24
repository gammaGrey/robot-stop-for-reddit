/*
  This slice was meant for use with the Oauth API to allow a user to login by granting RobotStop an access token.
  More features would be enabled with a logged in user, such as voting on posts and populating the filter list with a user's subscribed subreddits.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reddit from "../../../utilities/RedditOAuth";

export const login = createAsyncThunk(
  "userLogin/login",
  async () => {
    const authCode = await reddit.getAuthCode();
    
    if (authCode) {
      const accessToken = await reddit.getAccessToken(authCode);

      if (accessToken) {
        const { name, icon } = await reddit.getUser(accessToken);

        return {
          accessToken,
          user: {
            name,
            icon
          }
        };
      }
    }
  }
);

export const getSubreddits = createAsyncThunk(
  "userlogin/getSubreddits",
  async (a, thunkAPI) => {
    const state = thunkAPI.getState();
    const payload = await reddit.getSubreddits(state.userLogin.accessToken);
    return payload;
  }
);

const UserLoginSlice = createSlice({
  name: "userLogin",
  initialState: {
    user: {
      // username: null,
      // icon: null,
      // loginTime: null,
      usageTime: "0:00",
    },
    // accessToken: null,
    // subreddits: {
    //   list: null,
    //   isLoading: false,
    //   hasError: false
    // },
    // isLoading: false,
    // hasError: false,
  },
  reducers: {
    logout: (state) => {
      state.username = null;
      state.accessToken = null;
    },
    startTime: (state, action) => {
      state.user.loginTime = action.payload;
    },
    setUsageTime: (state, action) => {
      state.user.usageTime = action.payload;
    }
  },
  extraReducers: builder => {
    builder
    .addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.hasError = false;
      if (!state.accessToken && action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      state.user.username = action.payload.user.name;
      state.user.icon = action.payload.user.icon;
    })
    .addCase(login.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    })
    .addCase(login.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    })
    .addCase(getSubreddits.fulfilled, (state, action) => {
      state.subreddits.list = action.payload;
      state.subreddits.hasError = false;
      state.subreddits.isLoading = false;
    })
    .addCase(getSubreddits.pending, (state) => {
      state.subreddits.hasError = false;
      state.subreddits.isLoading = true;
    })
    .addCase(getSubreddits.rejected, (state) => {
      state.subreddits.hasError = true;
      state.subreddits.isLoading = false;
    })
  }
});

export default UserLoginSlice.reducer;

export const { logout, startTime, setUsageTime } = UserLoginSlice.actions;
export const UserLoginSelector = state => state.userLogin;