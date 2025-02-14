import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "~~/lib/store";
import { chatItem } from "~~/types/chat";


const chatAdapter = createEntityAdapter<chatItem>({

});

export const fetchChat = createAsyncThunk('exchange/fetchChat', async (chat: chatItem) => {
    return chat;
});

export interface chatState {
    error: string,
    status: string,
}

const initialState = chatAdapter.getInitialState({
    error: '',
    status: 'idle'
});

const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setchats: (state, action) => {
            chatAdapter.setAll(state, action.payload);
        },
        clearChats: (state) => {
            chatAdapter.removeAll(state);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChat.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchChat.fulfilled, (state, action) => {
                chatAdapter.addOne(state, action.payload);
                state.status = 'idle'
            })
            .addCase(fetchChat.rejected, (state) => {
                state.status = 'rejected';
                state.error = 'Un problème a été rencontré lors de la récupération de la liste des exchanges';
            })
    },
});

export const {
    selectAll: selectChats,
    selectById: selectChatById
} = chatAdapter.getSelectors((state: RootState) => state.chats);

export const selectChatIds = createSelector(
    selectChats,
    (chats) => chats.map((chat) => chat.id)
)

export const {
    setchats,
    clearChats
} = chatsSlice.actions;

export default chatsSlice.reducer;