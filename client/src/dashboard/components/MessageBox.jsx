import MessageList from "./MessageList";
import MessageBoxHeader from "./MessageBoxHeader";
import { memo } from "react";
import MessageBoxInput from "./MessageBoxInput";

function MessageBox() {
  console.log("MessageBox rendered");
  return (
    <div className="h-full lg:flex-grow lg:w-[calc(100%-360px)]  w-full flex flex-col items-center justify-center  shrink-0">
      <div className="h-full w-full bg-slate-200 lg:shadow-[0px_0px_1px_1px_#0000001b] ">
        <MessageBoxHeader />
        <MessageList />
        <MessageBoxInput />
      </div>
    </div>
  );
}

export default memo(MessageBox);
