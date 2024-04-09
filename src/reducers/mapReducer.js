import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_LAT_LNG, ZOOM_CONF } from '../const';

const initialState = {
  center: DEFAULT_LAT_LNG,
  zoomLevel: ZOOM_CONF.DEFAULT_ZOOM,
  minZoom: ZOOM_CONF.MIN_ZOOM,
  newCenter: null,
  newZoomLevel: null,
  polygon: true,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    setZoomLevel: (state, action) => {
      state.zoomLevel = action.payload;
    },
    setMinZoom: (state, action) => {
      state.minZoom = action.payload;
    },
    setNewCenter: (state, action) => {
      state.newCenter = action.payload;
    },
    setNewZoomLevel: (state, action) => {
      state.newZoomLevel = action.payload;
    },
    setPolygon: (state, action) => {
      state.polygon = action.payload;
    },
  },
});

export const { setCenter, setZoomLevel, setMinZoom, setNewCenter, setNewZoomLevel, setPolygon } =
  mapSlice.actions;

export default mapSlice.reducer;
