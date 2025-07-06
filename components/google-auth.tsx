import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import googleIcon from '../public/google.png'

interface GoogleContinueProps {
  loading: { google: boolean; credentials: boolean };
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<
    React.SetStateAction<{ google: boolean; credentials: boolean }>
  >;
}

const GoogleContinue: React.FC<GoogleContinueProps> = ({
  loading,
  setError,
  setLoading,
}) => {
  async function handleGoogleLogin() {
    setError(null);
    setLoading((prev) => ({ ...prev, google: true }));

    try {
      await signIn("google", { callbackUrl: "/panel" });
    } catch {
      setError("Google login failed");
      setLoading((prev) => ({ ...prev, google: false }));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        className="w-full cursor-pointer flex items-center justify-center gap-2"
        onClick={handleGoogleLogin}
        disabled={loading.google}
        type="button"
      >
        <Image src={googleIcon} width={20} height={20} alt="google icon" />
        {loading.google ? "Loading..." : "Login with Google"}
      </Button>
    </div>
  );
};

export default GoogleContinue;