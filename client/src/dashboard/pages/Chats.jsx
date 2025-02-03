// import img1 from "../../assets/image1.jpg";
import { useSelector } from "react-redux";
import MessageBox from "../components/MessageBox";
import ChatList from "../components/ChatList";
import ChatListHeader from "../components/ChatListHeader";
import SearchInput from "../components/SearchInput";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import sitting from "../../lotties/sitting.lottie";
import { memo } from "react";

function Chats() {
  const { selectedChatId } = useSelector((state) => state.chat);

  return (
    <div className="h-full w-full bg-white lg:rounded-lg- rounded-none lg:shadow-sm lg:overflow-hidden flex items-center">
      <div
        className={
          "h-full lg:w-[360px] w-full lg:bg-blue-50 flex flex-col items-center shrink-0" +
          (selectedChatId ? " chats-container-hide" : "")
        }
      >
        <ChatListHeader />
        <SearchInput />
        <ChatList />
      </div>
      {selectedChatId && <MessageBox />}
      {!selectedChatId && (
        <div className=" lg:border-l-0 h-full shadow-sm flex-grow lg:flex hidden flex-col items-center justify-center p-4 shrink-0">
          <div className=" h-[280px] p-4 flex items-center justify-center">
            {/* <img src={img1} alt="image" className="h-[400px]" /> */}
            <DotLottieReact src={sitting} loop autoplay />
          </div>
          <h1 className="text-2xl font-poppins text-blue-500 font-light mb-12">
            Select a chat to start new conversation
          </h1>
        </div>
      )}
    </div>
  );
}

export default memo(Chats);
