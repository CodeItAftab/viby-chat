import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { VerifyOTP } from "@/redux/slices/auth";
import { ChatsTeardrop } from "@phosphor-icons/react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function Otp() {
  const email = window.localStorage.getItem("email");
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(VerifyOTP({ email, otp }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full lg:grid  lg:grid-cols-1 h-full">
      <div className="flex items-center justify-center lg:py-0 lg:pb-12 py-20 ">
        <div className="mx-auto grid w-[480px] gap-6 items-start mb-32">
          <div className="grid gap-4 text-center mb-4">
            <div className="flex gap-2 2items-center mx-auto mb-14 justify-center">
              <ChatsTeardrop size={40} weight="fill" color="#1976d2" />
              <h1 className="text-3xl font-semibold">Viby Chat</h1>
            </div>
            <h1 className="text-xl font-semibold  ">Verify OTP</h1>
            <p className="text-balance text-muted-foreground leading-none">
              Enter the OTP sent to{" "}
              <span className="font-semibold text-black">{email}</span> to
              continue.
            </p>
          </div>
          <form
            className="grid gap-10 mx-auto items-start"
            noValidate
            onSubmit={handleSubmit}
          >
            <InputOTP
              maxLength={6}
              name="otp"
              className="w-[calc(100%-40px)]"
              onChange={(e) => setOtp(e)}
              value={otp}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  className="border-slate-400 h-14 w-14 text-lg"
                  index={0}
                />
                <InputOTPSlot
                  className="border-slate-400 h-14 w-14 text-lg"
                  index={1}
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  className="border-slate-400 h-14 w-14 text-lg"
                  index={2}
                />
                <InputOTPSlot
                  className="border-slate-400 h-14 w-14 text-lg"
                  index={3}
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  className="border-slate-400 h-14 w-14 text-lg"
                  index={4}
                />
                <InputOTPSlot
                  className="border-slate-400 h-14 w-14 text-lg"
                  index={5}
                />
              </InputOTPGroup>
            </InputOTP>

            <Button type="submit" className="w-full mx-auto h-12">
              Verify OTP
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
