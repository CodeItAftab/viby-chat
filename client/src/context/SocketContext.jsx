/* eslint-disable react/prop-types */
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FRIEND_CAME_ONLINE,
  FRIEND_READ_MESSAGE,
  FRIEND_REQUEST_ACCEPTED,
  FRIEND_REQUEST_CANCELLED,
  FRIEND_REQUEST_REJECTED,
  FRIEND_REQUEST_SENT,
  FRIEND_WENT_OFFLINE,
  MESSAGE_DELIVERED,
  NEW_FRIEND_REQUEST,
  READ_MESSAGE,
  REFETCH_FRIEND_REQUESTS,
  REFETCH_SENT_REQUESTS,
  NEW_MESSAGE_ALERT,
} from "@/constants/event";

import {
  FetchAllRequests,
  FetchAllSentRequests,
  makeSentRequest,
  removeRequestFromList,
  removeSentRequestFromList,
  setFriendOnlineStatusInUserSlice,
  unsentRequest,
} from "@/redux/slices/user";

import {
  FetchChats,
  makeMessageRead,
  makeMessagesDelivered,
  pushChat,
  pushNewMessage,
  readMessage,
  setFriendOnlineStatus,
  setSelectedUserOnlineStatus,
  updateLastMessageForNewMessage,
} from "@/redux/slices/chat";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const { userId } = useSelector((state) => state.auth);
  const { selectedChatId, chats } = useSelector((state) => state.chat);
  const { friends } = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (!socket && userId) {
  //     const io = connectSocket(userId);
  //     setSocket(io);
  //   }
  // }, [userId, socket]);

  useEffect(() => {
    document.title = "Viby Chat";
    // if (window.localStorage.getItem("reload")) {
    //   window.localStorage.removeItem("reload");
    //   window.location.reload();
    // }
  }, []);

  useEffect(() => {
    dispatch(FetchChats());
  }, [dispatch]);

  useEffect(() => {
    if (!socket) {
      setSocket(() => connectSocket(userId));
    }

    socket?.on("connect", () => {
      console.log("Connected to server");
      // console.log(userId, socket.id);
      // console.log(socket);
    });

    socket?.on("disconnect", () => {
      console.log("Disconnected from server");
      disconnectSocket();
      setSocket(null);
    });

    socket?.on(FRIEND_REQUEST_SENT, (data) => {
      // console.log(data);
      console.log("Friend Request Sent", data);
      dispatch(makeSentRequest(data.request));
    });

    socket?.on(NEW_FRIEND_REQUEST, () => {
      dispatch(FetchAllRequests());
      console.log("New Friend Request");
    });

    socket?.on(FRIEND_REQUEST_CANCELLED, (data) => {
      // console.log(data);
      dispatch(unsentRequest({ requestId: data.requestId }));
    });

    socket?.on(REFETCH_FRIEND_REQUESTS, () => {
      dispatch(FetchAllRequests());
    });

    socket?.on(REFETCH_SENT_REQUESTS, (data) => {
      dispatch(FetchAllSentRequests());
      dispatch(unsentRequest({ requestId: data.requestId }));
    });

    socket?.on(FRIEND_REQUEST_REJECTED, (data) => {
      // console.log(data);
      dispatch(removeRequestFromList({ requestId: data.requestId }));
    });

    socket?.on(FRIEND_REQUEST_ACCEPTED, (data) => {
      dispatch(removeRequestFromList({ requestId: data.requestId }));
      dispatch(
        removeSentRequestFromList({
          requestId: data.requestId,
          chatId: data.chatId,
        })
      );
    });

    socket?.on(NEW_MESSAGE_ALERT, (data) => {
      console.log(data);
      console.log("New Message Alert");
      // check if the chat is present in chats
      const chatIndex = chats.findIndex(
        (chat) => chat?.friendId === data.message.sender
      );
      console.log(chatIndex);

      if (chatIndex === -1) {
        // console.log("this work chat indesx ", chatIndex);
        const friendIndex = friends.findIndex(
          (friend) => friend.chatId === data.message.chatId
        );
        const friend = friends[friendIndex];
        console.log(friend);
        dispatch(
          pushChat({
            _id: friend.chatId,
            name: friend.name,
            friendId: friend._id,
            isOnline: friend.isOnline,
            // lastMessage: {
            //   content: data.message.content,
            //   createdAt: data.message.createdAt,
            //   isSender: false,
            //   state: data.message.state,
            // },
            lastMessage: undefined,
            unread: 0,
          })
        );
      }
      // updateLastMessageForNewMessage
      dispatch(
        updateLastMessageForNewMessage({
          chatId: data.message.chatId,
          message: data.message,
        })
      );
      // check if this chat is open or not
      // if open then push message to messages and make it read

      if (selectedChatId === data.message.chatId) {
        dispatch(pushNewMessage(data.message));
        socket?.emit(READ_MESSAGE, { chatId: data.message.chatId });
      }
    });

    socket?.on(FRIEND_CAME_ONLINE, (data) => {
      // console.log(data);
      dispatch(setFriendOnlineStatus({ chatId: data.chatId, isOnline: true }));
      dispatch(setSelectedUserOnlineStatus(true));
      dispatch(
        setFriendOnlineStatusInUserSlice({
          chatId: data.chatId,
          isOnline: true,
        })
      );
    });

    socket?.on(FRIEND_WENT_OFFLINE, (data) => {
      // console.log(data);
      dispatch(setFriendOnlineStatus({ chatId: data.chatId, isOnline: false }));
      dispatch(setSelectedUserOnlineStatus(false));
      dispatch(
        setFriendOnlineStatusInUserSlice({
          chatId: data.chatId,
          isOnline: false,
        })
      );
    });

    socket?.on(MESSAGE_DELIVERED, (data) => {
      console.log(data);
      console.log("Message Delivered");
      dispatch(makeMessagesDelivered({ chatIds: data.chatIds }));
    });

    socket?.on(READ_MESSAGE, (data) => {
      console.log("Read Message socket event", data);
      // dispatch(ReadMessage({ chatId: data.chatId }));
      dispatch(readMessage({ chatId: data.chatId }));
    });

    socket?.on(FRIEND_READ_MESSAGE, (data) => {
      dispatch(makeMessageRead({ chatId: data.chatId }));
    });

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off(FRIEND_REQUEST_SENT);
      socket?.off(NEW_FRIEND_REQUEST);
      socket?.off(FRIEND_REQUEST_CANCELLED);
      socket?.off(REFETCH_FRIEND_REQUESTS);
      socket?.off(REFETCH_SENT_REQUESTS);
      socket?.off(FRIEND_REQUEST_REJECTED);
      socket?.off(FRIEND_REQUEST_ACCEPTED);
      socket?.off(NEW_MESSAGE_ALERT);
      socket?.off(FRIEND_CAME_ONLINE);
      socket?.off(FRIEND_WENT_OFFLINE);
      socket?.off(MESSAGE_DELIVERED);
      socket?.off(READ_MESSAGE);
      socket?.off(FRIEND_READ_MESSAGE);
    };
  }, [userId, dispatch, selectedChatId, chats, friends, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
