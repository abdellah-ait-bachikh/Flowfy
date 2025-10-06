import { TBagInitialState } from "@/lib/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TBagInitialState = { orders: null };
const bagSlice = createSlice({
  name: "bag",
  initialState: initialState,
  reducers: {
    setBag(state, action: PayloadAction<TBagInitialState["orders"]>) {
      state.orders = action.payload;
    },
  },
});
