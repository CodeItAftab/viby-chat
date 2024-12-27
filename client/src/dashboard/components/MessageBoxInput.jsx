import { memo, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import { PaperPlaneTilt, Smiley } from "@phosphor-icons/react";
import { Paperclip } from "lucide-react";
import { useDispatch } from "react-redux";
import { sendMessage } from "@/redux/slices/chat";

function MessageBoxInput() {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(message);
    dispatch(sendMessage({ content: message }));
    setMessage("");
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form
      className="message-input-container  h-16 w-full   border-t-[1px] flex items-center justify-evenly lg:px-4 z-10 bg-white shrink-0"
      onSubmit={handleSubmit}
    >
      <div className="message-input h-10 w-[calc(100%-80px)] flex items-center bg-blue-50  rounded-[6px] overflow-hidden border-[2px_solid_black]">
        <input
          className="h-10 w-[calc(100%-40px)] px-3 leading-none outline-none rounded-[6px] bg-transparent text-black"
          type="text"
          name="message"
          id="message"
          maxLength={200}
          placeholder="Message..."
          autoComplete="off"
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton className="emoji-button h-10 w-10">
          <Smiley size={20} color="black" />
        </IconButton>
        <IconButton className="attachment-button h-10 w-10">
          <Paperclip size={20} color="black" />
        </IconButton>
      </div>
      <IconButton
        className="message-send-button"
        sx={{
          backgroundColor: "#9322ff",
          height: "40px",
          width: "60px",
          padding: "none",
          borderRadius: "10px",
          ":hover": { backgroundColor: "#1976d4" },
        }}
        onClick={handleSubmit}
      >
        <PaperPlaneTilt size={20} color="white" />
      </IconButton>
    </form>
  );
}
export default memo(MessageBoxInput);
