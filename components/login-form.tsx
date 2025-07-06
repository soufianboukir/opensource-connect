"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleContinue from "./google-auth";
import { Label } from "./ui/label";


export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ google: boolean; credentials: boolean }>({
    google: false,
    credentials: false,
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get("error");
    const emailParam = searchParams.get("email");
    
    if (urlError) {
      switch (urlError) {
        case "AccountExists":
          setError(`An account with email ${emailParam} already exists. Please sign in with your password instead.`);
          if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
          }
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading((l) => ({ ...l, credentials: true }));


    try {
        alert('signing in...')
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Network error. Please try again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading((l) => ({ ...l, credentials: false }));  
    }
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
            <GoogleContinue loading={loading} setError={setError} setLoading={setLoading} />

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              {error && (
                <div className="text-red-600 text-center mb-2">{error}</div>
              )}

              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700"
                  disabled={loading.credentials}
                >
                  {loading.credentials ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}