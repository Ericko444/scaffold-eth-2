import { configureStore } from '@reduxjs/toolkit'
import exchangesReducer from './features/land/exchangeSlice';
import auctionsReducer from './features/land/auctionSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            exchanges: exchangesReducer,
            auctions: auctionsReducer
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']