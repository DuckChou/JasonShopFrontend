import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

// 创建一个异步的action
export const getProduct = createAsyncThunk(
  'product/getProduct',
  async (id) => {
    try {
      const response = await axios.get(`https://jasonshop.space/api/products/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (product) => {
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
        // @ts-ignore
        `https://jasonshop.space/api/products/${product.id}/update`, 
        product,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

const initialState = {
  data: {},
  loading: false,
  error: null,
};

// createSlice 是一个 Redux Toolkit 提供的用于创建 Slice 的函数，它接受一个对象作为参数，该对象包含了以下几个属性：
// name: Slice 的名称，用于在开发者工具中显示。
// initialState: Slice 的初始状态。
// reducers: 用于处理同步 action 的 reducer 函数对象。该对象中的每个属性都对应一个同步 action，其属性值为一个 reducer 函数。
// extraReducers: 用于处理异步 action 的 extra reducer 函数对象。该对象中的每个属性都对应一个异步 action，其属性值为一个 reducer 函数。这些 reducer 函数是由 createAsyncThunk 创建的。

const ProductSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getProduct.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
    builder.addCase(updateProduct.fulfilled, (state,action) => {
      state.data = action.payload;
      state.loading = false;
    }
    );
  },
});

export default ProductSlice.reducer;
