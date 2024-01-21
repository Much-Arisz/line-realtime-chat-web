import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { UserModel, initialProfile } from '../models/users.model';

export interface RootState {
    auth: {
        isLogin: boolean;
        profile: UserModel;
    };
}

// ตั้งค่าเริ่มต้นสำหรับ state ของ Redux store
const initialState: RootState['auth'] = {
  isLogin: false,
  profile: initialProfile,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStoreIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setStoreProfile: (state, action: PayloadAction<UserModel>) => {
      state.profile = action.payload;
    },
  },
});

export const { setStoreIsLogin, setStoreProfile } = authSlice.actions;

export const authReducer = authSlice.reducer;

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export const loadStateFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined; 
    }
    return JSON.parse(serializedState); 
  }
};

export const saveStateToLocalStorage = (state: RootState['auth']) => {
  if (typeof window !== 'undefined') {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  }
};