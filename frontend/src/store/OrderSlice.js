import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

export const getOrder = createAsyncThunk('order/getOrder', async (id) => {
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
    const response = await axios.get(`/api/orders/${id}`, config);

    return response.data;
  } catch (error) {
    throw new Error('get order failed');
  }
});



const initialState = {
  order: [],
  shippingAddress: {},
  user: {},
  paymentMethod: '',
  shippingPrice: '',
  taxPrice: '',
  totalPrice: '',
  isPaid: false,
  paidAt: null,
  isDelivered: false,
  deliveredAt: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrder.pending, (state) => {
      state.loading = false;
    });
    builder.addCase(getOrder.fulfilled, (state, action) => {
      const {
        shippingAddress,
        orders,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
        user,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
      } = action.payload;
      state.order = orders;
      state.shippingAddress = shippingAddress;
      state.paymentMethod = paymentMethod;
      state.taxPrice = taxPrice;
      state.shippingPrice = shippingPrice;
      state.totalPrice = totalPrice;
      state.user = user;
      state.isPaid = isPaid;
      state.paidAt = paidAt;
      state.isDelivered = isDelivered;
      state.deliveredAt = deliveredAt;
      state.loading = false;
    });
    builder.addCase(getOrder.rejected, (state, action) => {
      // @ts-ignore
      state.error = action.error.message;
      state.loading = false;
    });
  },
});

export default orderSlice.reducer;
