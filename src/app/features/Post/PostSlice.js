import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reddit from "../../../utilities/RedditJSON";

export const getPage = createAsyncThunk(
  "post/getPage",
  async (_, { getState }) => {
    const { post } = getState();

    if (post.listIndex === post.list.length - 1) {
      const response = await reddit.getPage(post.filter.sub, post.filter.sort, post.after);
      return response;
    } else {
      const response = await reddit.getPage(post.filter.sub, post.filter.sort);
      console.log(response);
      return response; 
    }
  }
);

export const postVote = createAsyncThunk(
  "post/postVote",
  async (args, { getState }) => {
    const { userLogin } = getState();
    const response = await reddit.vote(args, userLogin.accessToken);
    console.log(response);
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    view: "post",
    list: [],
    listIndex: 0,
    after: null,
    link: {
      subreddit: null,
      url: null,
      id: null,
      title: null,
      imageURL: null,
      postText: null,
      isVideo: false,
      isGallery: false,
      galleryData: null,
      numComments: 0,
    },
    filter: {
      sub: "",
      sort: "hot",
    },
    isLoading: false,
    hasError: false,
  },
  reducers: {
    next: (state) => {
      state.listIndex++;
      state.link = state.list[state.listIndex];
    },
    filter: (state, action) => {
      state.filter.sub = action.payload;
    },
    sort: (state, action) => {
      if (action.payload) {
        state.filter.sort = action.payload;
      }
    },
    changeView: (state, action) => {
      state.view = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.listIndex = 0;

        let postList = action.payload.list;
        state.list = postList;
        state.link = postList[state.listIndex];
        state.after = action.payload.after;
      })
      .addCase(getPage.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getPage.rejected, (state) => {
        state.hasError = true;
        state.isLoading = false;
      })
  }
});

export default postSlice.reducer;

export const { next, filter, sort, changeView } = postSlice.actions;
export const postSelector = state => state.post;