import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socketio",
    initialState: {
        socket: null,
        onlineUsers: [],
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    },
});

export const { setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;
