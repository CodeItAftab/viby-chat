/* eslint-disable react/prop-types */
import { Check, Checks } from "phosphor-react";
import { getFromattedDate } from "../../utils/date";
import AvatarWithoutStatus from "./AvatarWithoutStatus";
import { forwardRef } from "react";
import { Link } from "react-router-dom";
// import { useEffect, useRef } from "react";

const MessageItem = forwardRef(function MessageItem({ message }, ref) {
  switch (message?.type) {
    case "text":
      return <TextMessage message={message} ref={ref} />;
    case "date":
      return <DateStamp date={message.date} ref={ref} />;
  }
});

const TextMessage = forwardRef(function TextMessage({ message }, ref) {
  // const unReadRef = useRef(null);

  // useEffect(() => {
  //   if (message?.isFirstUnread) {
  //     unReadRef.current.scrollIntoView({ behavior: "smooth"\ });
  //   }
  // }, [message]);

  return (
    <li
      className={`text-message flex gap-3 h-fit w-fit max-h-[900px] max-w-[95%] shrink-0  ${
        message?.isSender && "self-end"
      }`}
      id={message?.isFirstUnread ? "first_unread" : ""}
      // ref={message?.isFirstUnread ? unReadRef : null}
      ref={ref}
    >
      <div
        className={`sender-avatar shrink-0 h-5 w-5  ${
          message?.isSender && "order-2"
        }`}
      >
        <AvatarWithoutStatus />
      </div>
      <div className="flex flex-col">
        <div className="flex items-start gap-1 flex-col rounded-[8px]">
          <p
            className={`message  px-3 py-2 leading-5 inline-flex justify-center  text-sm   w-full lg:max-w-[600px] max-w-[400px]  rounded-[8px] overflow-ellipsis   ${
              message?.isSender
                ? "bg-[#6827ff] text-white  order-2"
                : "bg-slate-100 text-black"
            }`}
          >
            {/* {message} */}
            {message.content}
          </p>
        </div>
        <div
          className={
            "flex gap-1 w-full h-5 items-center justify-end" +
            (message?.isSender ? "" : "justify-start")
          }
        >
          {message.isSender && (
            <span className="flex items-center justify-center">
              {message.state === "read" && (
                <Checks
                  size={16}
                  color="#1976d2"
                  className="self-end text-slate-500"
                />
              )}
              {message.state === "delivered" && (
                <Checks size={16} className="self-end text-slate-500" />
              )}
              {message.state === "sent" && (
                <Check size={16} className="self-end text-slate-500" />
              )}
            </span>
          )}
          <span className={`time-stamp  text-[9px] leading-none`}>
            {new Date(message.createdAt).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </span>
        </div>
      </div>
    </li>
  );
});

export const LinkMessage = () => {
  return (
    <li
      className={`text-message flex flex-col items-center px-2 py-2 bg-[#3582ff]  h-36 max-h-fit w-80 max-w-[95%] rounded-sm shrink-0 self-end  `}
    >
      <Link
        to={"https://www.youtube.com/watch?v=MejbOFk7H6c"}
        target="_blank"
        className="link-preview-box h-20 w-full flex bg-slate-100 hover:shadow-md rounded-sm cursor-pointer "
      >
        <div className="previewImage h-20 w-20 overflow-hidden rounded-sm shrink-0">
          <img
            src="https://i.ytimg.com/vi/MejbOFk7H6c/maxresdefault.jpg"
            alt="preview"
            className="h-full object-cover rounded-t-sm"
          />
        </div>
        <div className="LinkDescription h-full flex-grow flex flex-col  justify-center p-2 box-border">
          <p className="link-title text-sm">
            {"OK Go - Needing/Getting - Official Video".substring(0, 20) +
              "..."}
          </p>
          <p className="text-xs text-slate-500">
            {`https://linktr.ee/okgomusic Website | http://www.okgo.netInstagram |
            http://www.instagram.com/okgoTwitter |
            http://www.twitter.com/okgoFacebook | http://www....`.substring(
              0,
              44
            ) + "..."}
          </p>
          <span className="hostname text-xs text-slate-400 mt-1 ">
            {new URL("https://www.youtube.com/watch?v=MejbOFk7H6c").hostname}
          </span>
        </div>
      </Link>
      <Link
        to={"https://www.youtube.com/watch?v=MejbOFk7H6c"}
        target="_blank"
        className="hover:underline w-full h-12 inline-flex items-center"
      >
        <span className="text-sm  text-wrap hover:underline text-blue-800 leading-normal">
          https://www.youtube.com/watch?v=MejbOFk7H6c
        </span>
      </Link>
    </li>
  );
};

const DateStamp = forwardRef(function DateStamp({ date }, ref) {
  return (
    <li
      className="date-stamp my-2 flex justify-center items-center w-full h-4 gap-2"
      ref={ref}
    >
      {/* <div className="h-[1px] w-[20%] bg-slate-100"></div> */}
      <span className="date-stamp-text text-[10px] leading-none bg-slate-100 font-semibold w-16  text-slate-500 h-6 flex items-center justify-center  px-2 rounded-sm">
        {getFromattedDate(date)}
      </span>
      {/* <div className="h-[1px] w-[20%] bg-slate-100"></div> */}
    </li>
  );
});

export default MessageItem;
