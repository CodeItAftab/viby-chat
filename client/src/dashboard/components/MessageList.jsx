import { memo, useCallback, useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { useSelector } from "react-redux";

import { useSocket } from "@/hooks/useSocket";
import { READ_MESSAGE } from "@/constants/event";
// import wallpaper from "@/assets/images/wallpaper.jpeg";

function MessageList() {
  const { messages, selectedChatId } = useSelector((state) => state.chat);
  let allMessages = [...messages];
  const { socket } = useSocket();

  allMessages = allMessages.reverse();
  const messageRefs = useRef([]);
  const chatListRef = useRef(null);

  const preprocessMessages = useCallback((messages) => {
    const processedMessages = [];
    let lastDate = null;
    let firstUnread = false;
    messages.forEach((message) => {
      const messageDate = new Date(message?.createdAt);
      if (messageDate.getDate() !== lastDate) {
        processedMessages.push({
          type: "date",
          date: messageDate,
        });
      }

      // check first unread message and add firstUnread:true
      if (
        (message?.state === "sent" || message?.state === "delivered") &&
        !message?.isSender &&
        !firstUnread
      ) {
        processedMessages.push({
          ...message,
          isFirstUnread: true,
        });
        firstUnread = true;
      } else {
        processedMessages.push(message);
      }

      lastDate = messageDate.getDate();
    });
    return processedMessages;
  }, []);
  const processedMessages = preprocessMessages(allMessages);
  // const dispatch = useDispatch();
  console.log("MessageList");

  useEffect(() => {
    socket?.emit(READ_MESSAGE, { chatId: selectedChatId });
  }, [selectedChatId, socket]);

  // useEffect(() => {
  //   const unreadMessageIndex = processedMessages.findIndex(
  //     (message) => message.isFirstUnread
  //   );

  // if (unreadMessageIndex !== -1) {
  //   messageRefs.current[unreadMessageIndex].scrollIntoView();
  // } else {
  //   // chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  // }
  // }, [processedMessages]);

  // console.log("scroll height", chatListRef.current?.scrollHeight);

  useEffect(() => {
    // scroll to bottom
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [processedMessages]);

  return (
    <ul
      ref={chatListRef}
      className="messages-box  w-full h-[calc(100%-120px)] flex-grow px-3 py-4 flex flex-col gap-2  overflow-auto bg-white  "
    >
      {processedMessages.map((message, index) => (
        <MessageItem
          ref={(el) => (messageRefs.current[index] = el)}
          key={message?._id ?? index}
          message={message}
        />
      ))}
      {/* <LinkMessage /> */}
    </ul>
  );
}

export default memo(MessageList);
