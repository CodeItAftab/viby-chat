import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "./ChatListItem";
import { useSelector } from "react-redux";
import { memo } from "react";

function ChatList() {
  const { chats } = useSelector((state) => state.chat);
  console.log("ChatList rendered");
  const conversations = [...chats];
  return (
    <ScrollArea className="w-full flex-grow lg:py-3">
      <ul className="w-full lg:px-4 lg:py-2 px-2 py-1 flex flex-col lg:gap-2 gap-1 items-center shrink-0">
        {/* {chats?.map(
          (chat) =>
            chat !== null && <ChatListItem key={chat?._id} chat={chat} />
        )} */}
        {conversations
          ?.sort((a, b) => {
            return (
              new Date(b?.lastMessage?.createdAt) -
              new Date(a?.lastMessage?.createdAt)
            );
          })
          .map(
            (chat) =>
              chat !== null && <ChatListItem key={chat?._id} chat={chat} />
          )}
      </ul>
    </ScrollArea>
  );
}

export default memo(ChatList);
