"use client";
import React, { useState } from "react";
import CustomSignUp from "../../../components/forms/custom-signup";
import { Star, TrendingUp, MessageCircle, Award } from "lucide-react";
import CustomSignIn from "../../../components/forms/custom-signin";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const ReviewBubble = ({ color, children }) => (
  <div
    className={`${color} rounded-full p-4 shadow-lg flex items-center space-x-2 animate-float`}
  >
    {children}
  </div>
);

const Page = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "on";

    console.log("Form data:", { email, password, rememberMe });

    // Basic validation
    if (!email || !password) {
      console.error("Email and password are required");
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting to sign in...");
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      console.log("Sign in result:", result);

      if (result?.error) {
        console.log("Sign in error:", result.error);
        toast.error(result.error);
      } else if (result?.ok) {
        console.log("Sign in successful");
        toast.success("Signed in successfully!");
        router.push(callbackUrl ?? "/dashboard");
      }
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-[#181c31] w-full h-full min-h-screen grid grid-cols-2 items-center">
      <div className="h-full flex flex-col justify-center items-center text-white p-8 relative overflow-hidden">
        <div className="relative w-[500px] h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <img
                src="/main.svg"
                className="w-48 rounded-full"
                alt="Review Management System"
              />
            </div>
          </div>

          <ReviewBubble color="bg-yellow-400 text-yellow-900 absolute top-0 left-1/4">
            <Star className="w-6 h-6" />
            <span>4.9</span>
          </ReviewBubble>

          <ReviewBubble color="bg-green-400 text-green-900 absolute bottom-1/4 right-0">
            <TrendingUp className="w-6 h-6" />
            <span>+23%</span>
          </ReviewBubble>

          <ReviewBubble color="bg-blue-400 text-blue-900 absolute bottom-0 left-1/4">
            <MessageCircle className="w-6 h-6" />
            <span>2.5k</span>
          </ReviewBubble>

          <ReviewBubble color="bg-purple-400 text-purple-900 absolute top-1/4 left-0">
            <Award className="w-6 h-6" />
            <span>#1</span>
          </ReviewBubble>
        </div>

        <p className="text-xl mt-8 text-center max-w-md">
          Harness the power of customer voices. Our AI-driven platform
          transforms feedback into actionable insights, boosting your reputation
          and revenue.
        </p>
      </div>
      <div className="h-full">
        <CustomSignIn handleSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default Page;
