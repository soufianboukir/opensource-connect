"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import OAuth from "./o-auth";
import Image from "next/image";


export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ google: boolean; github: boolean }>({
    google: false,
    github: false,
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get("error");
    const emailParam = searchParams.get("email");
    
    if (urlError) {
      switch (urlError) {
        case "AccountExists":
          setError(`An account with email ${emailParam} already exists. Please sign in with your password instead.`);
          break;
        case "OAuthSignin":
          setError("Error occurred during OAuth sign-in. Please try again.");
          break;
        case "OAuthCallback":
          setError("Error occurred during OAuth callback. Please try again.");
          break;
        case "OAuthCreateAccount":
          setError("Could not create OAuth account. Please try again.");
          break;
        case "EmailCreateAccount":
          setError("Could not create account with email. Please try again.");
          break;
        case "Callback":
          setError("Error occurred during callback. Please try again.");
          break;
        case "OAuthAccountNotLinked":
          setError("Email already associated with another account. Please sign in with your original method.");
          break;
        case "EmailSignin":
          setError("Error sending verification email. Please try again.");
          break;
        case "CredentialsSignin":
          setError("Invalid email or password. Please check your credentials.");
          break;
        case "SessionRequired":
          setError("You must be signed in to access this page.");
          break;
        default:
          setError("An authentication error occurred. Please try again.");
      }
      
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      url.searchParams.delete("email");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex items-center justify-center">
        <Image src={'/opensource-connect-logo.png'} width={70} height={70} alt="Platform logo"/>
       <span className="text-lg font-semibold">Opensource connect</span>
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google or Github account</CardDescription>
        </CardHeader>
        <CardContent>
              {error && (
                <div className="text-red-600 text-center mb-2">{error}</div>
              )}
            <br />
            <OAuth loading={loading} setError={setError} setLoading={setLoading} />

              
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  );
}