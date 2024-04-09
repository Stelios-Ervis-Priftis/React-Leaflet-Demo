import { combineReducers } from '@reduxjs/toolkit';
import mapReducer from './mapReducer';

const rootReducer = combineReducers({
  map: mapReducer,
  // Add other reducers here for different domains or features
});

export default rootReducer;
