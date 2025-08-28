import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationsReducer from './slices/notificationsSlice';
import connectionReducer from './slices/connectionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    connection: connectionReducer,
    notifications: notificationsReducer,
  },
});

export default store;