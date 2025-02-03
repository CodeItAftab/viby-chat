import { memo, useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { useDispatch, useSelector } from "react-redux";
import { ReadMessage } from "@/redux/slices/chat";

function MessageList() {
  const { messages } = useSelector((state) => state.chat);

  const [listMessages, setListMessages] = useState([]);

  const chatListRef = useRef(null);

  // Read Message
  const dispatch = useDispatch();

  useEffect(() => {
    const preprocessMessages = (messages) => {
      const processedMessages = [];
      let lastDate = null;
      // let firstUnread = false;
      messages.forEach((message) => {
        const messageDate = new Date(message?.createdAt);
        if (messageDate.getDate() !== lastDate) {
          processedMessages.push({
            type: "date",
            date: messageDate,
          });
        }

        // check first unread message and add firstUnread:true
        // if (
        //   (message?.state === "sent" || message?.state === "delivered") &&
        //   !message?.isSender &&
        //   !firstUnread
        // ) {
        //   processedMessages.push({
        //     ...message,
        //     isFirstUnread: true,
        //   });
        //   firstUnread = true;
        // } else {
        processedMessages.push(message);
        // }

        lastDate = messageDate.getDate();
      });
      return processedMessages;
    };

    setListMessages(preprocessMessages([...messages].reverse()));
    dispatch(ReadMessage());
  }, [messages, dispatch, setListMessages]);

  useEffect(() => {
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [listMessages]);

  return (
    <ul
      ref={chatListRef}
      className="messages-box  w-full h-[calc(100%-120px)] flex-grow px-3 py-4 flex flex-col gap-2  overflow-auto bg-white  "
    >
      {listMessages.map((message, index) => (
        <MessageItem key={message?._id ?? index} message={message} />
      ))}
      {/* <LinkMessage /> */}
    </ul>
  );
}

export default memo(MessageList);
