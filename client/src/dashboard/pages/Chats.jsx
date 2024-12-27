import img1 from "../../assets/image1.jpg";
import { useSelector } from "react-redux";
import MessageBox from "../components/MessageBox";
import ChatList from "../components/ChatList";
import ChatListHeader from "../components/ChatListHeader";
import SearchInput from "../components/SearchInput";

function Chats() {
  const { selectedChatId } = useSelector((state) => state.chat);

  return (
    <div className="h-full w-full bg-white lg:rounded-lg rounded-none lg:shadow-sm lg:overflow-hidden flex items-center">
      <div
        className={
          "h-full lg:w-[360px] w-full lg:bg-slate-100 flex flex-col items-center shrink-0" +
          (selectedChatId ? " chats-container-hide" : "")
        }
      >
        <ChatListHeader />
        <SearchInput />
        <ChatList />
      </div>
      {selectedChatId && <MessageBox />}
      {!selectedChatId && (
        <div className="h-full flex-grow lg:flex hidden flex-col items-center justify-center p-4 shrink-0">
          <div>
            <img src={img1} alt="image" className="h-[400px]" />
          </div>
          <h1 className="text-2xl text-blue-500 font-medium mb-12">
            Select a chat to start new conversation
          </h1>
        </div>
      )}
    </div>
  );
}

export default Chats;
