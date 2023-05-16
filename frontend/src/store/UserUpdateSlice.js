import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

export const getUserById = createAsyncThunk('admin/getUserById', async (id) => {
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
    const response = await axios.get(`/api/users/${id}`, config);

    return response.data;
  } catch (error) {
    throw new Error('get user failed');
  }
});

export const updateUserById = createAsyncThunk(
  'admin/updateUserById',
  async ({ id, name, email, isAdmin }) => {
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
      const response = await axios.put(
        `/api/users/${id}/update`,
        {
          name:name,
          email:email,
          isAdmin,
        },
        config
      );

      return response.data;
    } catch (error) {
      throw new Error('update User failed');
    }
  }
);

const initialState = {
  user: {},
  loading: false,
  error: null,
};

const userUpdateSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserById.pending, (state) => {
      state.loading = false;
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      // @ts-ignore
      state.error = action.error.message;
      state.loading = false;
    });

    builder.addCase(updateUserById.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userUpdateSlice.reducer;
