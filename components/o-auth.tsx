import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import googleIcon from '../public/google.png'
import githubIcon from '../public/github.png'

interface OAuthProps {
  loading: { google: boolean; github: boolean };
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<
    React.SetStateAction<{ google: boolean; github: boolean }>
  >;
}

const OAuth: React.FC<OAuthProps> = ({
  loading,
  setLoading,
}) => {
  async function handleGoogleOAuth() {
    setLoading((prev) => ({ ...prev, google: true }));
    await signIn("google", { callbackUrl: "/discovery" });
    setLoading((prev) => ({ ...prev, google: false }));
  }

  async function handleGithubOAuth() {
    setLoading((prev) => ({ ...prev, github: true }));
    await signIn("github", { callbackUrl: "/discovery" });
    setLoading((prev) => ({ ...prev, github: false }));
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        className="w-full cursor-pointer flex items-center justify-center gap-2 py-5"
        onClick={handleGoogleOAuth}
        disabled={loading.google}
        type="button"
      >
        <Image src={googleIcon} width={20} height={20} alt="google icon" />
        {loading.google ? "Loading..." : "Login with google"}
      </Button>

      <Button
        variant="outline"
        className="w-full cursor-pointer hover:bg-black/85 dark:hover:bg-white/85 dark:bg-white dark:text-black hover:text-white bg-black text-white flex items-center justify-center gap-2 py-5"
        onClick={handleGithubOAuth}
        disabled={loading.github}
        type="button"
      >
        <Image src={githubIcon} width={20} height={20} alt="google icon" className="invert dark:invert-0"/>
        {loading.github ? "Loading..." : "Login with github"}
      </Button>
    </div>
  );
};

export default OAuth;