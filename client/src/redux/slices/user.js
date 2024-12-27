import { getRequest } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: undefined,
  users: [],
  requests: [],
  chats: [],
  sentRequests: [],
  friends: [],
};

export const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setRequests(state, action) {
      state.requests = action.payload;
    },
    setSentRequests(state, action) {
      state.sentRequests = action.payload;
    },
    setFriends(state, action) {
      state.friends = action.payload;
    },
    addRequest(state, action) {
      state.requests = state.requests.concat(action.payload);
    },
    addSentRequest(state, action) {
      state.sentRequests = state.sentRequests.concat(action.payload);
    },
    addReceivedRequest(state, action) {
      state.receivedRequests = state.receivedRequests.concat(action.payload);
    },
    makeSentRequest(state, action) {
      state.users = state.users.map((user) =>
        user._id.toString() === action.payload.receiver._id.toString()
          ? { ...user, isSentRequest: true, requestId: action.payload._id }
          : user
      );
    },
    removeRequestFromList(state, action) {
      state.requests = state.requests.filter(
        (request) =>
          request._id.toString() !== action.payload.requestId.toString()
      );
    },
    removeSentRequestFromList(state, action) {
      state.sentRequests = state.sentRequests.filter(
        (request) =>
          request._id.toString() !== action.payload.requestId.toString()
      );

      state.users = state.users.map((user) =>
        user?.requestId?.toString() === action.payload.requestId.toString()
          ? {
              ...user,
              isSentRequest: false,
              isReceivedRequest: false,
              isFriend: true,
              chatId: action.payload.chatId,
              requestId: null,
            }
          : user
      );
    },

    setFriendOnlineStatusInUserSlice: (state, action) => {
      state.friends = state.friends.map((user) =>
        user.chatId === action.payload.chatId
          ? { ...user, isOnline: action.payload.isOnline }
          : user
      );
    },

    unsentRequest(state, action) {
      state.users = state.users.map((user) =>
        user?.requestId?.toString() === action.payload.requestId.toString()
          ? {
              ...user,
              isSentRequest: false,
              requestId: null,
              isReceivedRequest: false,
            }
          : user
      );

      state.sentRequests = state.sentRequests.filter(
        (request) =>
          request._id.toString() !== action.payload.requestId.toString()
      );
    },

    resetUserSlice(state) {
      state.user = undefined;
      state.users = [];
      state.requests = [];
      state.sentRequests = [];
      state.friends = [];
    },
  },
});

export const {
  setUsers,
  addRequest,
  addReceivedRequest,
  addSentRequest,
  makeSentRequest,
  unsentRequest,
  setSentRequests,
  setRequests,
  removeRequestFromList,
  removeSentRequestFromList,
  setFriends,
  resetUserSlice,
  setFriendOnlineStatusInUserSlice,
} = slice.actions;

export default slice.reducer;

export const FetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/user/all/users");
      if (response.success) {
        console.log(response);
        dispatch(slice.actions.setUsers(response.users));
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
);

export const FetchAllRequests = createAsyncThunk(
  "user/fetchAllRequests",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/user/all/requests");
      if (response.success) {
        dispatch(slice.actions.setRequests(response.requests));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const FetchAllSentRequests = createAsyncThunk(
  "user/fetchAllSentRequests",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/user/all/sent_requests");
      if (response.success) {
        console.log(response);
        dispatch(slice.actions.setSentRequests(response.requests));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const FetchAllFriends = createAsyncThunk(
  "user/fetchAllFriends",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/user/all/friends");
      if (response.success) {
        console.log(response);
        dispatch(slice.actions.setFriends(response.friends));
      }
    } catch (error) {
      console.log(error);
    }
  }
);
