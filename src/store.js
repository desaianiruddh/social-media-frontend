import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import userReducer from './redux/userSlice';

const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, userReducer);
const store = configureStore({
  reducer: {
    userData: persistedReducer,
  },
});

export default store;
export const persistor = persistStore(store);
