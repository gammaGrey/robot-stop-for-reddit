import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reddit from "../../../utilities/RedditJSON";

export const loadComments = createAsyncThunk(
  "comments/loadComments",
  async (_, thunkAPI) => {
    const {post} = thunkAPI.getState();
    const comments = await reddit.getComments(post.link.subreddit, post.link.id);
    console.log(comments);

    return comments; //an array of comment objects
  }
);

export const moreComments = createAsyncThunk(
  "comments/moreComments",
  async (_, { getState }) => {
    const {post, comments} = getState();
    const children = comments.commentList[comments.commentList.length - 1].idArray.toString();
    const moreComments = await reddit.getMoreComments(post.link.id, children);

    return moreComments;
  }
);

/*
export const commentVote = createAsyncThunk(
  "comment/commentVote",
  async (args, { getState }) => {
    const { userLogin } = getState();
    const response = await reddit.vote(args, userLogin.accessToken);
    console.log(response);
  }
);
*/

const CommentsSlice = createSlice({
  name: "comments",
  initialState: {
    commentList: [], // array of comment objects
    isLoading: false,
    hasError: false,
    comment: { // Top Level Comment currently rendered on screen
      author: null,
      body: null,
      index: 0,
      id: null,
      userVote: null,
    },
    reply: {
      list: null, // array of reply objects
    },
  },
  reducers: {
    nextComment: (state) => {
      state.comment.index++;
      state.comment.body = state.commentList[state.comment.index].body;
      state.comment.author = state.commentList[state.comment.index].author;
      state.comment.id = state.commentList[state.comment.index].id;
      state.reply.list = state.commentList[state.comment.index].replies;
    },
    firstComment: (state) => {
      state.commentList = null;
      
      state.comment.index = 0;
      state.comment.body = null;
      state.comment.author = null;
    },
    openReply: (state) => {
      state.reply.index = 0;
    },
  },
  extraReducers: builder => {
    builder
    .addCase(loadComments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.hasError = false;
      state.commentList = action.payload;

      state.comment.index = 0;
      state.comment.body = action.payload[0].body;
      state.comment.author = action.payload[0].author;
      state.comment.id = action.payload[0].id;
      state.reply.list = action.payload[0].replies;
    })
    .addCase(loadComments.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    })
    .addCase(loadComments.rejected, (state) => {
      state.hasError = true;
      state.isLoading = false;
    })

    .addCase(moreComments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.hasError = false;
      state.commentList = action.payload;

      state.comment.index = 0;
      state.comment.body = action.payload[0].body;
      state.comment.author = action.payload[0].author;
      state.comment.id = action.payload[0].id;
      state.reply.list = action.payload[0].replies;
    })
    .addCase(moreComments.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    })
    .addCase(moreComments.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    })
  }
});

export default CommentsSlice.reducer;
export const { upvote, downvote, nextComment, firstComment } = CommentsSlice.actions;
export const commentsSelector = state => state.comments;