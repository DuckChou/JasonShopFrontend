import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

export const getAllUsers = createAsyncThunk('admin/getAllUsers', async () => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // @ts-ignore
        Authorization: `Bearer ${
          // @ts-ignore
          JSON.parse(localStorage.getItem('userInfo')).token
        }`,
      },
    };
    const response = await axios.get(`/api/users/`, config);

    return response.data;
  } catch (error) {
    throw new Error('get order failed');
  }
});



const initialState = {
  userList:[],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.userList = action.payload;
      state.loading = false;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      // @ts-ignore
      state.error = action.error.message;
      state.loading = false;
    });
  },
});

export default adminSlice.reducer;
