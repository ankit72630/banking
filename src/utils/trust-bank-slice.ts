import { createSlice } from "@reduxjs/toolkit";
import { KeyWithAnyModel } from "./model/common-model";
const initialState: KeyWithAnyModel = {
       trustBank : {}
};

const trustBank = createSlice({
        name: "trustBank",
        initialState,
        reducers: {
                UpdateTrustBank(state, action) {
                    state.trustBank = action.payload;
                }
        }
});
export const trustBankAction = trustBank.actions;
export default trustBank;
