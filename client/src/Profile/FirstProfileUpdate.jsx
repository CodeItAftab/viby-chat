import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

import welcome from "../assets/welcome.png";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setFirstLogin } from "@/redux/slices/auth";
import { Navigate } from "react-router-dom";
import { firstProfileUpdate } from "@/redux/slices/user";

function FirstProfileUpdate() {
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const { isLoggedIn, isFirstLogin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("avatar", avatar);
    dispatch(firstProfileUpdate(formData));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  if (!isFirstLogin) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="h-full w-full flex  items-center justify-center gap-8">
      <div className="h-[500px] w-5/12 flex items-center justify-center">
        <img src={welcome} className="h-full" alt="welcome" />
      </div>
      <div className="h-full w-5/12 flex flex-col items-center justify-center ">
        <div className="w-full flex justify-between mb-3">
          <div className="h-full flex flex-col">
            <h1 className="text-3xl font-poppins font-light mb-2 tracking-wide">
              Welcome to <strong className="text-blue-500">Viby Chat!</strong>
            </h1>
            <h3 className="text-muted-foreground">
              Update Your Account to continue
            </h3>
          </div>
          <Button
            variant="outline"
            className="w-20 rounded-full border-blue-400"
            onClick={() => dispatch(setFirstLogin(false))}
          >
            Skip
          </Button>
        </div>
        <form
          className="w-full   py-8 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="h-44 w-44 relative">
            <label
              htmlFor="avatar"
              className="h-44 w-44 rounded-full cursor-pointer relative border-2 overflow-hidden bg-slate-100 flex items-center justify-center"
            >
              {avatar && (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="avatar"
                  className="object-cover h-full"
                />
              )}
            </label>
            <label
              htmlFor="avatar"
              className="h-8 w-8 rounded-full z-20 flex items-center justify-center bg-blue-500 cursor-pointer absolute right-2 bottom-2"
            >
              <Pencil size={16} color="white" />
            </label>
          </div>
          <div className="w-full flex flex-col gap-3 py-2 mt-4">
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Label
              htmlFor="bio"
              className="text-base font-normal leading-normal tracking-wide"
            >
              Your Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              className="w-full  h-24  resize-none"
              placeholder="Enter your bio here"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full my-4 bg-blue-600 hover:bg-blue-700"
          >
            Update
          </Button>
        </form>
      </div>
    </div>
  );
}

export default FirstProfileUpdate;
