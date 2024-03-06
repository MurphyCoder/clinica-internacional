'use client';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  isError: boolean;
  message: string | null;
  isOpenSiderbar: boolean;
  isOpenSiderbarFilterVehicle: boolean;
  isOpenModal: boolean;
}

const initialState: UIState = {
  isLoading: false,
  isError: false,
  message: null,
  isOpenSiderbar: false,
  isOpenSiderbarFilterVehicle: false,
  isOpenModal: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // REGISTER SEARCH
    setSeach(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },

    // ALERT REGISTER
    setAlert(
      state,
      action: PayloadAction<{ message: string; type: string } | null>
    ) {
      state.message = action.payload ? action.payload.message : null;
      state.isError = action.payload ? action.payload.type === 'error' : false;
    },

    // SLIDERBAR
    setOpenSiderbar(state, action: PayloadAction<boolean>) {
      state.isOpenSiderbar = action.payload;
    },

    // SLIDERBAR FILTRO VEHICULOS
    setOpenSiderbarFilterVehicle(state, action: PayloadAction<boolean>) {
      state.isOpenSiderbarFilterVehicle = action.payload;
    },

    // MODAL
    setOpenModal(state, action: PayloadAction<boolean>) {
      state.isOpenModal = action.payload;
    },
  },
});

export default uiSlice.reducer;

export const {
  setSeach,
  setAlert,
  setOpenSiderbar,
  setOpenSiderbarFilterVehicle,
  setOpenModal,
} = uiSlice.actions;

// ----------------------------------------------------------------------

export const registerSeach = (payload: string | null) => (dispatch: any) => {
  dispatch(setSeach(payload || ''));
};

export const registerAlert =
  (payload: { message: string; type: string } | null) => (dispatch: any) => {
    dispatch(setAlert(payload));
  };

export const openSiderbar = (payload: boolean) => (dispatch: any) => {
  dispatch(setOpenSiderbar(payload));
};

export const openSiderbarFilterVehicle =
  (payload: boolean) => (dispatch: any) => {
    dispatch(setOpenSiderbarFilterVehicle(payload));
  };

export const openModal = (payload: boolean) => (dispatch: any) => {
  dispatch(setOpenModal(payload));
};
