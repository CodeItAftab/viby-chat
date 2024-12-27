// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import {
  Chats,
  ChatsTeardrop,
  Gear,
  MagnifyingGlass,
  Power,
  UserPlus,
  Users,
} from "@phosphor-icons/react";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "@/redux/slices/auth";

const menu = [
  { Icon: Chats, link: "/" },
  {
    Icon: Users,
    link: "/friends",
  },
  {
    Icon: UserPlus,
    link: "/requests",
  },
  {
    Icon: MagnifyingGlass,
    link: "/search",
  },
  {
    Icon: Gear,
    link: "/settings",
  },
];

function Navbar() {
  const dispatch = useDispatch();
  const { selectedChatId } = useSelector((state) => state.chat);

  return (
    <nav
      className={
        "lg:h-full lg:w-20 h-12 w-full lg:bg-slate-300 bg-white shrink-0 flex lg:flex-col items-center justify-between gap-32 lg:py-1 lg:pl-2 px-2" +
        (selectedChatId ? " chats-container-hide" : "")
      }
    >
      <header className="h-12 w-12 flex items-center justify-center lg:mx-auto">
        <ChatsTeardrop size={32} color="#1976d4" weight="fill" />
      </header>
      <ul className="w-14 lg:flex hidden lg:flex-col gap-4 items-center bg-white py-4 rounded-xl shadow-sm">
        {menu.map(({ Icon, link }) => (
          <NavLink to={link} key={link}>
            {({ isActive }) =>
              isActive ? (
                <div className="h-10 w-10 flex items-center justify-center cursor-pointer active:bg-slate-300 rounded-full hover:bg-slate-200">
                  <Icon size={28} color="#1976d4" weight="fill" />
                </div>
              ) : (
                <div className="h-10 w-10 flex items-center justify-center cursor-pointer active:bg-slate-300 rounded-full hover:bg-slate-200">
                  <Icon size={28} color="black" />
                </div>
              )
            }
          </NavLink>
        ))}
      </ul>
      <footer className="lg:h-20 lg:w-14 h-10 w-10 flex items-center justify-center">
        {/* <Avatar className="h-10 w-10">
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="h-10 w-10"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar> */}
        <IconButton
          sx={{ backgroundColor: "white" }}
          onClick={() => {
            dispatch(LogoutUser());
          }}
          className="lg:h-10 lg:w-10 h-8 w-8"
        >
          <Power size={28} color="red" />
        </IconButton>
      </footer>
    </nav>
  );
}

export default Navbar;
