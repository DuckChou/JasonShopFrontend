import { configureStore } from '@reduxjs/toolkit';
import ProductsReducer from './ProductsReducer';
import ProductReducer from './ProductReducer';
import CartReducer from './CartReducer';
import UserReducer from './UserReducer';
import OrderReducer from './OrderSlice';
import AdminReducer from './AdminSlice';
import UserUpdateReducer from './UserUpdateSlice';


export const store = configureStore({
  reducer: {
    products: ProductsReducer,
    product: ProductReducer,
    cart: CartReducer,
    user: UserReducer,
    order : OrderReducer,
    admin : AdminReducer,
    updateUser: UserUpdateReducer,
  },
});


