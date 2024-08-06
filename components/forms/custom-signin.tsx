"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { signIn } from "next-auth/react";

// Define the validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export default function CustomSignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "demo@gmail.com",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);

  type UserFormValue = z.infer<typeof formSchema>;

  const onSubmit = async (data: UserFormValue) => {
    console.log("onSubmit function called", data);
    setLoading(true);

    console.log("Attempting to sign in...");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      redirect: false,
      callbackUrl: callbackUrl ?? "/dashboard",
    });
    console.log("Sign in result:", result);

    if (result?.error) {
      console.log("Sign in error:", result.error);
      toast.error(
        result.error == "CredentialsSignin"
          ? "Invalid credentials"
          : "An error occurred. Please try again later.",
      );
    } else if (result?.ok) {
      console.log("Sign in successful");
      toast.success("Signed in successfully!");
      router.replace(callbackUrl ?? "/dashboard");
    }
  };
  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic here
    console.log("Google sign-in clicked");
    signIn("google", { callbackUrl: callbackUrl ?? "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">
          Welcome Back{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Sign in to your account to continue
        </p>

        {/* Google Sign-In Button */}
        <Button
          onClick={handleGoogleSignIn}
          className="w-full mt-6 bg-white text-gray-700 border border-gray-300 rounded-2xl p-6 flex items-center justify-center space-x-2 hover:bg-gray-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          <span>Continue with Google</span>
        </Button>

        {/* Divider */}
        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="w-full border-gray-300" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <Input placeholder="Email Address" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" {...register("rememberMe")} />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none"
              >
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600">
              Forgot password?
            </a>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-blue-600">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
