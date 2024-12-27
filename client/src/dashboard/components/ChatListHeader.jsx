import { ListFilter, SquarePen } from "lucide-react";
import { memo } from "react";

function ChatListHeader() {
  return (
    <header className="w-full lg:p-3 pb-1 lg:pl-4 lg:pr-4 pl-4 pr-3 flex items-center justify-between">
      <h1 className="lg:font-poppins lg:text-xl text-sm text-[#1976d4] font-medium">
        All Chats
      </h1>
      <div className="flex items-center gap-3">
        {/* <div className="h-8 w-8 flex items-center justify-center cursor-pointer active:bg-slate-300 rounded-full hover:bg-slate-200">
          <SquarePen size={20} color="#1976d4" />
        </div> */}
        <div className="h-8 w-8 flex items-center justify-center cursor-pointer active:bg-slate-300 rounded-full hover:bg-slate-200">
          <ListFilter color="#1976d4" className="lg:w-5 lg:h-5 w-4 h-4" />
        </div>
      </div>
    </header>
  );
}

export default memo(ChatListHeader);
