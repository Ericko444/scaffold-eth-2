import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "~~/lib/store";
import { Land, AuctionDTO } from "~~/types/land";

const auctionsAdapter = createEntityAdapter<AuctionDTO>({

});

export const fetchAuction = createAsyncThunk('auction/fetchAuction', async (auction: AuctionDTO) => {
    return [auction];
});

export interface auctionState {
    error: string,
    status: string
}

const initialState = auctionsAdapter.getInitialState({
    error: '',
    status: 'idle'
});

const auctionsSlice = createSlice({
    name: 'auction',
    initialState,
    reducers: {
        setAuctions: (state, action) => {
            auctionsAdapter.setAll(state, action.payload);
        },
        updateAuction: (state, action) => {
            auctionsAdapter.updateOne(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuction.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchAuction.fulfilled, (state, action) => {
                auctionsAdapter.setAll(state, action.payload);
                state.status = 'idle'
            })
            .addCase(fetchAuction.rejected, (state) => {
                state.status = 'rejected';
                state.error = 'Un problème a été rencontré lors de la récupération de la liste des encheres';
            })
    },
});

export const {
    selectAll: selectAuctions,
    selectById: selectAuctionById
} = auctionsAdapter.getSelectors((state: RootState) => state.auctions);

export const selectAuctionIds = createSelector(
    selectAuctions,
    (auctions) => auctions.map((auction) => auction.id)
)

export const {
    setAuctions,
    updateAuction,
} = auctionsSlice.actions;

export default auctionsSlice.reducer;