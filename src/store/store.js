import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import connectionReducer from './slices/connectionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    connection: connectionReducer
  },
});

export default store;