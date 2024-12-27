/* eslint-disable react/prop-types */
import { faker } from "@faker-js/faker";
import AvatarWithStatus from "./AvatarWithStatus";
import { IconButton } from "@mui/material";
import { Chat, CheckCircle, XCircle, UserPlus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
// import { socket } from "@/lib/socket";
import {
  ACCEPT_FRIEND_REQUEST,
  CANCEL_FRIEND_REQUEST,
  READ_MESSAGE,
  REJECT_FRIEND_REQUEST,
  SEND_FRIEND_REQUEST,
} from "@/constants/event";

import { useDispatch, useSelector } from "react-redux";
import {
  FetchChatMessages,
  pushChat,
  setSelectedChatId,
  setSelectedUser,
  setSelectedUserId,
} from "@/redux/slices/chat";
import { getFromattedTime } from "@/utils/date";
import { Check } from "lucide-react";
import { Checks } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";

export function ChatListItem({ chat }) {
  const { selectedChatId } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  return (
    <div
      className="h-16 w-full bg-white cursor-pointer  flex items-center lg:p-2 px-2 py-0 shrink-0 rounded-lg lg:shadow-sm"
      onClick={async () => {
        if (selectedChatId !== chat?._id) {
          await dispatch(FetchChatMessages(chat?._id));
          await dispatch(setSelectedUserId(chat?.friendId));
          await dispatch(
            setSelectedUser({
              name: chat?.name,
              isOnline: chat?.isOnline,
            })
          );
          await dispatch(setSelectedChatId(chat?._id));
          // }
        }
      }}
    >
      <div className="avatar-container h-10 w-10 rounded-full bg-white">
        <AvatarWithStatus isOnline={chat?.isOnline} />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-3 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-base font-medium leading-none text-slate-700">
          {chat?.name}
        </h2>
        <div className="flex items-center gap-1">
          {chat?.lastMessage?.isSender && (
            <span className="flex items-center justify-center">
              {chat?.lastMessage?.state === "read" && (
                <Checks
                  size={16}
                  color="#1976d2"
                  className="self-end text-slate-500"
                />
              )}
              {chat?.lastMessage?.state === "delivered" && (
                <Checks size={16} className="self-end text-slate-500" />
              )}
              {chat?.lastMessage?.state === "sent" && (
                <Check size={16} className="self-end text-slate-500" />
              )}
            </span>
          )}
          <p className="last-message text-sm leading-none text-slate-500 text-nowrap ">
            {/* {faker.lorem.sentence().slice(0, 30) + "..."} */}

            {chat?.lastMessage?.content.length > 30
              ? chat?.lastMessage?.content.slice(0, 25) + "..."
              : chat?.lastMessage?.content}
          </p>
        </div>
      </div>
      <div className="chat-time-container h-full w-14 flex flex-col items-center ;g:justify-around lg:gap-0 justify-center gap-2 ">
        <span
          className={
            "last-message-time text-[12px] leading-none text-slate-500 font-semibold" +
            (chat?.unread ? " text-[#1976d2] " : "")
          }
        >
          {/* 10:10 AM */}
          {chat &&
            chat.lastMessage !== undefined &&
            getFromattedTime(new Date(chat?.lastMessage?.createdAt))}
          {/* {faker.number.int({ min: 1, max: 12 })}:
          {faker.number.int({ min: 1, max: 12 })} */}
          {/* {new Date(chat?.lastMessage?.time)?.toLocaleTimeString()} */}
        </span>
        <span
          className={
            "new-message-count h-5 w-5 flex items-center justify-center text-[12px] bg-[#1976d2] text-white leading-none  rounded-full" +
            (chat?.unread ? "" : " bg-transparent text-transparent")
          }
        >
          {/* {faker.number.int({ min: 0, max: 99 })} */}
          {chat?.unread > 0 && chat?.unread}
        </span>
      </div>
    </div>
  );
}

export function FriendListItem({ user }) {
  const { chats } = useSelector((state) => state.chat);
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div
      className="h-16 w-full bg-white cursor-pointer  flex items-center p-2 rounded-lg shadow-sm"
      onClick={() => {
        console.log(user);
        dispatch(setSelectedUserId(user._id));
        dispatch(
          setSelectedUser({
            name: user.name,
            isOnline: user.isOnline,
          })
        );
        dispatch(setSelectedChatId(user?.chatId));
        const chatIndex = chats.findIndex((chat) => chat?._id === user?.chatId);
        if (chatIndex === -1) {
          dispatch(
            pushChat({
              _id: user.chatId,
              name: user.name,
              friendId: user._id,
              isOnline: user.isOnline,
              lastMessage: undefined,
              unread: 0,
            })
          );
        } else {
          dispatch(FetchChatMessages(user?.chatId));
          socket?.emit(READ_MESSAGE, { chatId: user?.chatId });
        }
        navigate("/");
      }}
    >
      <div className="avatar-container h-10 w-10 rounded-full bg-white">
        <AvatarWithStatus isOnline={user?.isOnline} />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-3 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-base font-medium leading-none text-slate-700">
          {user ? user.name : faker.person.fullName()}
        </h2>
      </div>
      <div className="chat-time-container h-full w-16 flex flex-col items-center justify-center gap-2">
        <IconButton>
          <Chat size={24} color="#1976d4" />
        </IconButton>
      </div>
    </div>
  );
}

export function RequestListItem({ user }) {
  const { socket } = useSocket();
  return (
    <div className="h-16 w-full bg-white cursor-pointer  flex items-center p-2 rounded-lg shadow-sm">
      <div className="avatar-container h-10 w-10 rounded-full bg-white">
        <AvatarWithStatus />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-2 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-sm font-poppins whitespace-nowrap overflow-ellipsis font-medium pr-2 leading-none text-slate-700">
          {user ? user.name : faker.person.fullName().slice(0, 24) + "..."}
        </h2>
      </div>
      <div className="chat-time-container h-full w-20 px-3 flex  items-center justify-center gap-1">
        <IconButton
          sx={{ padding: 1 }}
          onClick={() =>
            socket?.emit(REJECT_FRIEND_REQUEST, {
              requestId: user.requestId,
              senderId: user._id,
            })
          }
        >
          <XCircle size={28} color="red" />
        </IconButton>
        <IconButton
          sx={{ padding: 1 }}
          onClick={() =>
            socket?.emit(ACCEPT_FRIEND_REQUEST, {
              requestId: user.requestId,
            })
          }
        >
          <CheckCircle size={28} color="#1976d4" />
        </IconButton>
      </div>
    </div>
  );
}

export function SentRequestListItem({ user }) {
  const { socket } = useSocket();
  return (
    <div className="h-16 w-full bg-white cursor-pointer  flex items-center p-2 rounded-lg shadow-sm">
      <div className="avatar-container h-10 w-10 rounded-full bg-white">
        <AvatarWithStatus />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-2 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-sm font-poppins whitespace-nowrap overflow-ellipsis font-medium pr-2 leading-none text-slate-700">
          {user?.name || faker.person.fullName().slice(0, 24) + "..."}
        </h2>
      </div>
      <div className="chat-time-container h-full w-20 px-3 flex  items-center justify-center gap-1">
        <Button
          variant="outline"
          onClick={() =>
            socket?.emit(CANCEL_FRIEND_REQUEST, {
              requestId: user.requestId,
              receiverId: user._id,
            })
          }
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function SearchListItem({ user }) {
  const { socket } = useSocket();
  return (
    <div className="h-16 w-full bg-white cursor-pointer  flex items-center p-2 rounded-lg shadow-sm">
      <div className="avatar-container h-10 w-10 rounded-full bg-white">
        <AvatarWithStatus />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-2 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-base font-poppins whitespace-nowrap overflow-ellipsis font-medium pr-2 leading-none text-slate-700">
          {user?.name}
        </h2>
      </div>
      <div className="chat-time-container h-full w-16  flex  items-center justify-center ">
        <IconButton
          onClick={() => socket.emit(SEND_FRIEND_REQUEST, { to: user._id })}
        >
          <UserPlus size={24} color="#1976d4" />
        </IconButton>
      </div>
    </div>
  );
}
