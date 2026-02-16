import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      // Normalize user object for all login types
      const normalizedUser = {
        ...action.payload,
        user: {
          ...action.payload.user,
          _id: action.payload.user._id || action.payload.user.id,
          username: action.payload.user.username || action.payload.user.name,
        },
      };
      state.currentUser = normalizedUser;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },

    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    updateUserSuccess: (state, action) => {
      if (state.currentUser?.user) {
        state.currentUser.user = {
          ...state.currentUser.user,
          ...action.payload
        };
        // Update localStorage to persist changes
        localStorage.setItem('user', JSON.stringify(state.currentUser));
      }
      state.loading = false;
      state.error = null;
    },
    
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },



    deleteUserStart: (state) => {
      state.loading = true;
    },

    deleteUserSuccess: (state) => {
      state.currentUser = null,
      state.loading = false;
      state.error = null;
    },

    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      
    },


    SignOutUserStart: (state) => {
      state.loading = true;
    },

    SignOutUserSuccess: (state) => {
      state.currentUser = null,
      state.loading = false;
      state.error = null;
    },

    SignOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      
    },

  },
});

export const { 
  signInStart, 
  signInSuccess, 
  signInFailure, 
  signOut, 
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  
  SignOutUserStart,
  SignOutUserSuccess,
  SignOutUserFailure

} = userSlice.actions;
export default userSlice.reducer;
