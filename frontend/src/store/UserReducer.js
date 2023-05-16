import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

export const login = createAsyncThunk('login', async ({ email, password }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(
      `https://jasonshop.space/api/users/login`,
      {
        username: email,
        password: password,
      },
      config
    );

    localStorage.setItem('userInfo', JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
});

export const register = createAsyncThunk(
  'register',
  async ({ email, password, name }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      console.log(email, password, name);

      const response = await axios.post(
        `https://jasonshop.space/api/users/register`,
        {
          name: name,
          email: email,
          password: password,
        },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(response.data));

      console.log(JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'updateProfile',
  async ({ email, password, name, token }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `https://jasonshop.space/api/users/profile/update`,
        {
          name: name,
          email: email,
          password: password,
        },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(response.data));

      console.log(JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

const userInfoFormLocalStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFormLocalStorage,
  loading: false,
  error: null,
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
  },
});

export default UserSlice.reducer;

export const { logout } = UserSlice.actions;
