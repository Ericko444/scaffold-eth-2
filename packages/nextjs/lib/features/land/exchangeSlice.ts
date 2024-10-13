import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "~~/lib/store";
import { Land, ExchangeRequestDTO } from "~~/types/land";

const exchangesAdapter = createEntityAdapter<ExchangeRequestDTO>({

});

export const fetchRequest = createAsyncThunk('exchange/fetchRequest', async (exchange: ExchangeRequestDTO) => {
    return [exchange];
});

export interface exchangeState {
    error: string,
    status: string
}

const initialState = exchangesAdapter.getInitialState({
    error: '',
    status: 'idle'
});

const exchangesSlice = createSlice({
    name: 'exchanges',
    initialState,
    reducers: {
        setExchanges: (state, action) => {
            exchangesAdapter.setAll(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequest.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchRequest.fulfilled, (state, action) => {
                exchangesAdapter.setAll(state, action.payload);
                state.status = 'idle'
            })
            .addCase(fetchRequest.rejected, (state) => {
                state.status = 'rejected';
                state.error = 'Un problème a été rencontré lors de la récupération de la liste des exchanges';
            })
    },
});

export const {
    selectAll: selectExchanges,
    selectById: selectExchangeById
} = exchangesAdapter.getSelectors((state: RootState) => state.exchanges);

export const selectEmployeIds = createSelector(
    selectExchanges,
    (exchanges) => exchanges.map((exchanges) => exchanges.id)
)

export const {
    setExchanges
} = exchangesSlice.actions;

export default exchangesSlice.reducer;