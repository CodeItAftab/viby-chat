import { SocketContext } from "@/context/SocketContext";
import { useContext } from "react";

const useSocket = () => {
  return useContext(SocketContext);
};

export { useSocket };
