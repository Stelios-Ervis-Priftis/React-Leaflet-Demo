// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/mapReducer'; // Import your root reducer here

const store = configureStore({
  reducer: rootReducer,
  // Add other middleware or configuration options here if needed
});

export default store;
