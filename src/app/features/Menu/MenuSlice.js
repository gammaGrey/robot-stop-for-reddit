// this file is a work in progress

import { createSlice } from "@reduxjs/toolkit";

const MenuSlice = createSlice({
  name: "menu",
  initialState: {
    welcome: true,
    // options:{
    //   colourScheme: "default",
    //   fontSize: 16,
    //   postLimit: 25,
    //   commentLimit: 25,
    // },
    toggle: {
      filter: false,
      timer: true,
      // voteBySwipe: true,
    }
    /*Menu options:
      *colour scheme
      *text size
      *amount of comments/posts to load
      
    *Toggles:
      *Show timer
      *Enable vote by swipe (L=↓, R=↑)
    */
  },
  reducers: {
    closeWelcome: (state) => {
      state.welcome = false;
    },
    toggleFilters: (state) => {
      state.toggle.filter = !state.toggle.filter;
    },
    toggleTimer: (state) => {
      state.toggle.timer = !state.toggle.timer;
    }
  }
});

export default MenuSlice.reducer;

export const { closeWelcome, toggleFilters, toggleTimer } = MenuSlice.actions;
export const menuSelector = state => state.menu;