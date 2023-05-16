import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

// 创建一个异步的action
// 拿到单个商品的数据
export const getCartProducts = createAsyncThunk(
  'cart/getCartProducts',
  async ({ id, qty }) => {
    try {
      const response = await axios.get(`https://jasonshop.space/api/products/${id}`);

      return { ...response.data, qty };
    } catch (error) {
      throw new Error(error);
    }
  }
);

const cartItemFormLocalStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFormLocalStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {};


const initialState = {
  cartItems: cartItemFormLocalStorage,
  loading: false,
  error: null,
  shippingAddress: shippingAddressFormLocalStorage,
  paymentMethod: '',
  
};

// createSlice 是一个 Redux Toolkit 提供的用于创建 Slice 的函数，它接受一个对象作为参数，该对象包含了以下几个属性：
// name: Slice 的名称，用于在开发者工具中显示。
// initialState: Slice 的初始状态。
// reducers: 用于处理同步 action 的 reducer 函数对象。该对象中的每个属性都对应一个同步 action，其属性值为一个 reducer 函数。
// extraReducers: 用于处理异步 action 的 extra reducer 函数对象。该对象中的每个属性都对应一个异步 action，其属性值为一个 reducer 函数。这些 reducer 函数是由 createAsyncThunk 创建的。

const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    changeItemQty(state, action) {
      const { id, qty } = action.payload;
      console.log(id, qty);

      const item = state.cartItems.find((x) => x._id === id);

      if (item) {
        item.qty = qty;
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));

    },
    removeItem(state, action) {
      const id = action.payload;

      state.cartItems = state.cartItems.filter((x) => x._id !== id);

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    cleanCart(state) {
      state.cartItems = [];

      localStorage.removeItem('cartItems');
    },
    saveShippingAddress(state, action) {
      const { address, city, postalCode, country } = action.payload;

      state.shippingAddress = {
        address,
        city,
        postalCode,
        country,
      };

      localStorage.setItem(
        'shippingAddress',
        JSON.stringify(state.shippingAddress)
      );
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
      
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCartProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCartProducts.fulfilled, (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // state.cartItems.map((x) => {
        //   if (x._id === existItem._id) {
        //     x.qty = item.qty;
        //   }
        // });

        state.cartItems.forEach((x)=>{
          if(x._id === existItem._id){
            x.qty = item.qty;
          }
        })
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));

      state.loading = false;
    });
    builder.addCase(getCartProducts.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
  },
});



export default CartSlice.reducer;
export const { changeItemQty,removeItem,saveShippingAddress,savePaymentMethod,cleanCart } = CartSlice.actions;
